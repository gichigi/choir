"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type BrandVoicePillar = {
  name: string;
  whatItMeans: string[];
  whatItDoesntMean: string[];
  iconicBrandInspiration: string[];
};

type OnboardingData = {
  businessName: string;
  yearFounded: string;
  businessDescription: string;
  website: string;
  targetAudience: string;
  companyValues: string;
  additionalInfo: string;
  brandVoice: {
    pillars: BrandVoicePillar[];
  } | null;
};

type OnboardingContextType = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onboardingData: OnboardingData;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  isGeneratingVoice: boolean;
  setIsGeneratingVoice: (isGenerating: boolean) => void;
  saveToConvex: () => Promise<void>;
  saveToSession: () => void;
  sessionId: string;
  isLoggedIn: boolean;
  onboardingDataId: string | null;
  brandVoiceId: string | null;
  redirectToSignIn: () => void;
};

const defaultOnboardingData: OnboardingData = {
  businessName: "",
  yearFounded: "",
  businessDescription: "",
  website: "",
  targetAudience: "",
  companyValues: "",
  additionalInfo: "",
  brandVoice: null,
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(defaultOnboardingData);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [onboardingDataId, setOnboardingDataId] = useState<string | null>(null);
  const [brandVoiceId, setBrandVoiceId] = useState<string | null>(null);
  
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  // Convex mutations and queries
  const saveSessionData = useMutation(api.onboarding.saveOnboardingDataForSession);
  const saveUserData = useMutation(api.onboarding.saveOnboardingDataForUser);
  const createBrandVoice = useMutation(api.brandVoices.createBrandVoice);
  const userOnboardingData = useQuery(api.onboarding.getOnboardingDataForUser);
  const userBrandVoice = useQuery(api.brandVoices.getUserBrandVoice);

  // Initialize session ID
  useEffect(() => {
    // Check if we have a session ID in localStorage
    let storedSessionId = localStorage.getItem("onboardingSessionId");
    if (!storedSessionId) {
      // If not, generate a new one
      storedSessionId = uuidv4();
      localStorage.setItem("onboardingSessionId", storedSessionId);
    }
    setSessionId(storedSessionId);

    // Check if we have onboarding data in localStorage
    const storedData = localStorage.getItem("onboardingData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setOnboardingData(parsedData);
      } catch (error) {
        console.error("Failed to parse stored onboarding data:", error);
      }
    }
  }, []);

  // Load user data if logged in
  useEffect(() => {
    if (isLoaded && isSignedIn && userOnboardingData) {
      // If the user has onboarding data in Convex, use that
      setOnboardingDataId(userOnboardingData._id);
      setOnboardingData({
        businessName: userOnboardingData.businessName,
        yearFounded: userOnboardingData.yearFounded,
        businessDescription: userOnboardingData.businessDescription,
        website: userOnboardingData.website,
        targetAudience: userOnboardingData.targetAudience,
        companyValues: userOnboardingData.companyValues,
        additionalInfo: userOnboardingData.additionalInfo || "",
        brandVoice: null, // Will be loaded separately
      });
    }

    if (isLoaded && isSignedIn && userBrandVoice) {
      // If the user has a brand voice in Convex, use that
      setBrandVoiceId(userBrandVoice._id);
      setOnboardingData((prev) => ({
        ...prev,
        brandVoice: {
          pillars: userBrandVoice.pillars,
        },
      }));
    }
  }, [isLoaded, isSignedIn, userOnboardingData, userBrandVoice]);

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData((prev) => {
      const newData = { ...prev, ...data };
      // Save to localStorage
      localStorage.setItem("onboardingData", JSON.stringify(newData));
      return newData;
    });
  };

  // Save data to session only
  const saveToSession = () => {
    localStorage.setItem("onboardingData", JSON.stringify(onboardingData));
    localStorage.setItem("onboardingSessionId", sessionId);
  };

  // Save data to Convex (only when generating brand voice or completing)
  const saveToConvex = async () => {
    try {
      if (isSignedIn) {
        // Save for logged-in user
        const dataId = await saveUserData({
          businessName: onboardingData.businessName,
          yearFounded: onboardingData.yearFounded,
          businessDescription: onboardingData.businessDescription,
          website: onboardingData.website,
          targetAudience: onboardingData.targetAudience,
          companyValues: onboardingData.companyValues,
          additionalInfo: onboardingData.additionalInfo,
          sessionId: sessionId,
        });
        setOnboardingDataId(dataId);

        // If we have brand voice data, save that too
        if (onboardingData.brandVoice) {
          const voiceId = await createBrandVoice({
            onboardingDataId: dataId,
            pillars: onboardingData.brandVoice.pillars,
          });
          setBrandVoiceId(voiceId);
        }

        return;
      } else {
        // Save for non-logged-in user
        const dataId = await saveSessionData({
          sessionId: sessionId,
          businessName: onboardingData.businessName,
          yearFounded: onboardingData.yearFounded,
          businessDescription: onboardingData.businessDescription,
          website: onboardingData.website,
          targetAudience: onboardingData.targetAudience,
          companyValues: onboardingData.companyValues,
          additionalInfo: onboardingData.additionalInfo,
        });
        setOnboardingDataId(dataId);
      }
    } catch (error) {
      console.error("Failed to save onboarding data:", error);
    }
  };

  // Redirect to sign in/sign up with session data
  const redirectToSignIn = () => {
    // Store the session ID to be used after sign-in
    localStorage.setItem("pendingOnboardingSession", sessionId);
    
    // Redirect to sign-in page
    router.push("/sign-in?redirect_url=/dashboard");
  };

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        onboardingData,
        updateOnboardingData,
        isGeneratingVoice,
        setIsGeneratingVoice,
        saveToConvex,
        saveToSession,
        sessionId,
        isLoggedIn: isSignedIn || false,
        onboardingDataId,
        brandVoiceId,
        redirectToSignIn,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
} 