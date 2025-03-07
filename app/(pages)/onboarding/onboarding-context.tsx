"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

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
};

const defaultOnboardingData: OnboardingData = {
  businessName: "",
  yearFounded: "",
  businessDescription: "",
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

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
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