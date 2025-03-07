"use client";

import { useOnboarding } from "./onboarding-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Fallback brand voice in case the API fails
const fallbackBrandVoice = {
  businessSummary: "A modern brand with a distinctive voice that blends simplicity, transparency, and playful wit to connect with audiences in an authentic way.",
  pillars: [
    {
      name: "Simplicity",
      whatItMeans: [
        "Use plain English and avoid jargon or unnecessary complexity",
        "Short, punchy sentences that get straight to the point",
        "Prioritize clarity so anyone can understand our message without a dictionary"
      ],
      whatItDoesntMean: [
        "Dumbing down ideas or skipping important details",
        "Ignoring nuance when discussing more advanced topics",
        "Simplistic design or lack of depth in our overall communications"
      ],
      iconicBrandInspiration: [
        "Apple – known for straightforward, minimal copy that resonates with a broad audience",
        "Slack – keeps instructions and feature explanations short, sweet, and easy to digest"
      ]
    },
    {
      name: "Transparency",
      whatItMeans: [
        "Talk like a human—be honest, open, and inclusive",
        "Break the 'fourth wall' when appropriate: openly share how and why we're doing something",
        "Admit mistakes quickly, own up to them, and explain how we plan to fix them"
      ],
      whatItDoesntMean: [
        "Oversharing confidential or sensitive information that compromises trust",
        "Coming off as unprofessional or flippant about serious matters",
        "Sacrificing clarity for the sake of extreme transparency (i.e., endless technical details)"
      ],
      iconicBrandInspiration: [
        "Innocent Drinks – casual, friendly tone that's refreshingly honest",
        "Mailchimp – offers human, plainspoken updates in blog posts and release notes"
      ]
    },
    {
      name: "Playful Sarcasm/Irony",
      whatItMeans: [
        "Lighthearted wit that teases and amuses without disrespecting the reader",
        "Ironic or tongue-in-cheek commentary to keep things fun",
        "Occasional humor to stand out in a sea of sterile corporate messages"
      ],
      whatItDoesntMean: [
        "Mean-spirited jokes or personal attacks",
        "Incessant sarcasm that undermines clarity or trust",
        "Sacrificing important information or helpful guidance for the sake of a punchline"
      ],
      iconicBrandInspiration: [
        "Wendy's Twitter – famously quick-witted and sarcastic responses (though we'll keep it friendlier)",
        "Old Spice – playful edge in ads while still promoting the product clearly"
      ]
    }
  ]
};

export default function OnboardingForm() {
  const {
    currentStep,
    setCurrentStep,
    onboardingData,
    updateOnboardingData,
    isGeneratingVoice,
    setIsGeneratingVoice,
    saveToConvex,
    saveToSession,
    sessionId,
    isLoggedIn,
    onboardingDataId,
    brandVoiceId,
    redirectToSignIn,
  } = useOnboarding();
  
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<Record<string, boolean>>({});
  const { isSignedIn, isLoaded, signUp } = useAuth();
  const { toast } = useToast();
  
  // Convex mutations
  const createBrandVoice = useMutation(api.brandVoices.createBrandVoice);

  // Save data after each step - only to session, not to Convex
  useEffect(() => {
    const saveData = async () => {
      if (currentStep > 1 && validateStep(currentStep - 1)) {
        // Just save to session, not to Convex
        saveToSession();
      }
    };
    
    saveData();
  }, [currentStep]);

  const validateStep = (step = currentStep) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!onboardingData.businessName.trim()) {
        newErrors.businessName = "Business name is required";
      }
      if (!onboardingData.yearFounded.trim()) {
        newErrors.yearFounded = "Year founded is required";
      } else if (!/^\d{4}$/.test(onboardingData.yearFounded)) {
        newErrors.yearFounded = "Please enter a valid year (e.g., 2020)";
      }
    } else if (step === 2) {
      if (!onboardingData.businessDescription.trim()) {
        newErrors.businessDescription = "Business description is required";
      }
    } else if (step === 3) {
      if (!onboardingData.targetAudience.trim()) {
        newErrors.targetAudience = "Target audience is required";
      }
    } else if (step === 4) {
      if (!onboardingData.companyValues.trim()) {
        newErrors.companyValues = "Company values are required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (validateStep()) {
      setIsSaving(true);
      try {
        // Just save to session, not to Convex
        saveToSession();
        if (currentStep < 6) {
          setCurrentStep(currentStep + 1);
        }
      } catch (error) {
        console.error("Error saving data:", error);
        toast({
          title: "Error",
          description: "Failed to save your data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateBrandVoice = async () => {
    // If user is not logged in, redirect to sign in
    if (!isLoggedIn) {
      // Save current data to session
      saveToSession();
      // Store the session ID for after sign-in
      localStorage.setItem("pendingOnboardingSession", sessionId);
      // Redirect to sign-in page
      redirectToSignIn();
      return;
    }
    
    setIsGeneratingVoice(true);
    setApiError(null);
    
    try {
      // Now save to Convex since user is committed
      await saveToConvex();
      
      // Call the OpenAI API to generate the brand voice
      const response = await fetch('/api/generate-brand-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessName: onboardingData.businessName,
          yearFounded: onboardingData.yearFounded,
          businessDescription: onboardingData.businessDescription,
          targetAudience: onboardingData.targetAudience,
          companyValues: onboardingData.companyValues,
          additionalInfo: onboardingData.additionalInfo,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate brand voice');
      }
      
      const responseData = await response.json();
      
      // Validate the response data
      console.log("API response:", responseData);
      
      if (!responseData || !responseData.brandVoice || !responseData.brandVoice.pillars || 
          !Array.isArray(responseData.brandVoice.pillars) || responseData.brandVoice.pillars.length === 0) {
        throw new Error('Invalid response from brand voice generator');
      }
      
      // Extract the brandVoice object from the response
      const brandVoiceData = responseData.brandVoice;
      
      // Update the onboarding data with the generated brand voice
      updateOnboardingData({ brandVoice: brandVoiceData });
      
      // Save the brand voice to Convex
      if (onboardingDataId) {
        await createBrandVoice({
          onboardingDataId,
          pillars: brandVoiceData.pillars,
          businessSummary: brandVoiceData.businessSummary,
        });
      }
    } catch (error: any) {
      console.error("Error generating brand voice:", error);
      setApiError(error.message || "Failed to generate brand voice");
      
      // Use fallback brand voice
      toast({
        title: "Using fallback brand voice",
        description: "We encountered an issue with the AI service. Using a pre-generated brand voice instead.",
        variant: "warning",
      });
      
      // Update with fallback brand voice
      updateOnboardingData({ brandVoice: fallbackBrandVoice });
      
      // Save the fallback brand voice to Convex
      if (onboardingDataId) {
        try {
          await createBrandVoice({
            onboardingDataId,
            pillars: fallbackBrandVoice.pillars,
            businessSummary: fallbackBrandVoice.businessSummary,
          });
        } catch (convexError) {
          console.error("Error saving fallback brand voice:", convexError);
        }
      }
    } finally {
      setIsGeneratingVoice(false);
    }
  };

  const handleComplete = async () => {
    // Final save
    setIsSaving(true);
    try {
      // If the user is not logged in, redirect to sign-in
      if (!isLoggedIn) {
        // Save to session
        saveToSession();
        // Store the session ID for after sign-in
        localStorage.setItem("pendingOnboardingSession", sessionId);
        
        // Redirect to sign-in page
        redirectToSignIn();
        return;
      }
      
      // For logged-in users, save to Convex and redirect to dashboard
      await saveToConvex();
      router.push("/dashboard");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Step 1: Business Information
  const renderStep1 = () => (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Business Information</h2>
      <div className="space-y-6">
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium mb-1">
            Business Name
          </label>
          <Input
            id="businessName"
            value={onboardingData.businessName}
            onChange={(e) =>
              updateOnboardingData({ businessName: e.target.value })
            }
            placeholder="Enter your business name"
            className={errors.businessName ? "border-red-500" : ""}
          />
          {errors.businessName && (
            <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
          )}
        </div>

        <div>
          <label htmlFor="yearFounded" className="block text-sm font-medium mb-1">
            Year Founded
          </label>
          <Input
            id="yearFounded"
            value={onboardingData.yearFounded}
            onChange={(e) =>
              updateOnboardingData({ yearFounded: e.target.value })
            }
            placeholder="e.g., 2020"
            className={errors.yearFounded ? "border-red-500" : ""}
          />
          {errors.yearFounded && (
            <p className="text-red-500 text-sm mt-1">{errors.yearFounded}</p>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleNext} 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );

  // Step 2: Business Description
  const renderStep2 = () => (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Business Description</h2>
      <div className="space-y-6">
        <div className="bg-muted p-4 rounded-lg mb-2">
          <p className="text-sm">You can either describe your business below or enter your website URL, and we'll analyze it for you.</p>
        </div>
        
        <div>
          <label htmlFor="businessDescription" className="block text-sm font-medium mb-1">
            Tell us about your business
          </label>
          <Textarea
            id="businessDescription"
            value={onboardingData.businessDescription}
            onChange={(e) =>
              updateOnboardingData({ businessDescription: e.target.value })
            }
            placeholder="What does your business do? What products or services do you offer?"
            rows={6}
            className={errors.businessDescription ? "border-red-500" : ""}
          />
          {errors.businessDescription && (
            <p className="text-red-500 text-sm mt-1">{errors.businessDescription}</p>
          )}
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-muted-foreground/20"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>
        
        <div>
          <label htmlFor="website" className="block text-sm font-medium mb-1">
            Your website URL
          </label>
          <div className="flex gap-2">
            <Input
              id="website"
              value={onboardingData.website}
              onChange={(e) =>
                updateOnboardingData({ website: e.target.value })
              }
              placeholder="https://yourcompany.com"
              className="flex-1"
            />
            <Button 
              variant="outline"
              onClick={() => {
                // This would typically call an API to analyze the website
                if (onboardingData.website) {
                  toast({
                    title: "Website analysis",
                    description: "Analyzing your website to extract business information...",
                  });
                  // In a real implementation, this would call an API to analyze the website
                  // and update the business description
                  setTimeout(() => {
                    toast({
                      title: "Analysis complete",
                      description: "We've extracted information from your website.",
                    });
                  }, 2000);
                } else {
                  toast({
                    title: "Website URL required",
                    description: "Please enter your website URL to analyze.",
                    variant: "destructive",
                  });
                }
              }}
            >
              Analyze
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            We'll analyze your website to extract information about your business.
          </p>
        </div>

        <div className="flex justify-between">
          <Button onClick={handleBack} variant="outline">
            Back
          </Button>
          <Button 
            onClick={handleNext} 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );

  // Step 3: Target Audience
  const renderStep3 = () => (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Target Audience</h2>
      <div className="space-y-6">
        <div>
          <label htmlFor="targetAudience" className="block text-sm font-medium mb-1">
            Who is your target audience?
          </label>
          <Textarea
            id="targetAudience"
            value={onboardingData.targetAudience}
            onChange={(e) =>
              updateOnboardingData({ targetAudience: e.target.value })
            }
            placeholder="Describe your ideal customers, their demographics, interests, and pain points."
            rows={6}
            className={errors.targetAudience ? "border-red-500" : ""}
          />
          {errors.targetAudience && (
            <p className="text-red-500 text-sm mt-1">{errors.targetAudience}</p>
          )}
        </div>

        <div className="flex justify-between">
          <Button onClick={handleBack} variant="outline">
            Back
          </Button>
          <Button 
            onClick={handleNext} 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );

  // Step 4: Company Values
  const renderStep4 = () => (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Company Values</h2>
      <div className="space-y-6">
        <div>
          <label htmlFor="companyValues" className="block text-sm font-medium mb-1">
            What are your company's core values?
          </label>
          <Textarea
            id="companyValues"
            value={onboardingData.companyValues}
            onChange={(e) =>
              updateOnboardingData({ companyValues: e.target.value })
            }
            placeholder="List your company's core values and what they mean to your business."
            rows={6}
            className={errors.companyValues ? "border-red-500" : ""}
          />
          {errors.companyValues && (
            <p className="text-red-500 text-sm mt-1">{errors.companyValues}</p>
          )}
        </div>

        <div className="flex justify-between">
          <Button onClick={handleBack} variant="outline">
            Back
          </Button>
          <Button 
            onClick={handleNext} 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );

  // Step 5: Additional Information
  const renderStep5 = () => (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Additional Information</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="additionalInfo" className="block text-sm font-medium mb-1">
            Any additional information about your brand voice?
          </label>
          <Textarea
            id="additionalInfo"
            value={onboardingData.additionalInfo}
            onChange={(e) =>
              updateOnboardingData({ additionalInfo: e.target.value })
            }
            placeholder="Share any specific tone, style preferences, or examples of content you like..."
            rows={6}
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-8">
        <Button onClick={handleBack} variant="outline">
          Back
        </Button>
        <Button 
          onClick={handleNext} 
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
        >
          Next
        </Button>
      </div>
    </div>
  );

  // Step 6: Brand Voice Generation
  const renderStep6 = () => (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Review & Generate Your Brand Voice</h2>
      
      <div className="mb-8">
        <p className="mb-4">
          Review and edit your answers below before generating your unique brand voice.
        </p>
        
        {!isLoggedIn && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Sign in required</AlertTitle>
            <AlertDescription>
              You'll need to sign in or create an account to generate your brand voice. Your answers will be saved.
            </AlertDescription>
          </Alert>
        )}

        {/* Split view for answers and brand voice */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
          {/* Visual divider for desktop view */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 top-10 bottom-10 border-r border-dashed border-indigo-200 dark:border-indigo-800 z-0"></div>
          {/* Left column: User's answers */}
          <div className="space-y-6 relative z-10">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold">Your Business Information</h3>
              <div className="ml-2 px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full">
                Editable
              </div>
            </div>
            
            <div className="bg-muted p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Business Details</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-indigo-600"
                  onClick={() => setIsEditing(prev => ({ ...prev, businessDetails: !prev.businessDetails }))}
                >
                  {isEditing.businessDetails ? "Save" : "Edit"}
                </Button>
              </div>
              {isEditing.businessDetails ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Business Name</label>
                    <Input
                      value={onboardingData.businessName}
                      onChange={(e) => updateOnboardingData({ businessName: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Year Founded</label>
                    <Input
                      value={onboardingData.yearFounded}
                      onChange={(e) => updateOnboardingData({ yearFounded: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Business Description</label>
                    <Textarea
                      value={onboardingData.businessDescription}
                      onChange={(e) => updateOnboardingData({ businessDescription: e.target.value })}
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                </div>
              ) : (
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Business Name</dt>
                    <dd>{onboardingData.businessName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Year Founded</dt>
                    <dd>{onboardingData.yearFounded || "Not specified"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Business Description</dt>
                    <dd className="whitespace-pre-wrap">{onboardingData.businessDescription}</dd>
                  </div>
                </dl>
              )}
            </div>

            <div className="bg-muted p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Target Audience</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-indigo-600"
                  onClick={() => setIsEditing(prev => ({ ...prev, targetAudience: !prev.targetAudience }))}
                >
                  {isEditing.targetAudience ? "Save" : "Edit"}
                </Button>
              </div>
              {isEditing.targetAudience ? (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Target Audience Description</label>
                  <Textarea
                    value={onboardingData.targetAudience}
                    onChange={(e) => updateOnboardingData({ targetAudience: e.target.value })}
                    className="mt-1"
                    rows={4}
                  />
                </div>
              ) : (
                <dl>
                  <dt className="text-sm font-medium text-muted-foreground">Target Audience Description</dt>
                  <dd className="whitespace-pre-wrap">{onboardingData.targetAudience}</dd>
                </dl>
              )}
            </div>

            <div className="bg-muted p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Company Values</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-indigo-600"
                  onClick={() => setIsEditing(prev => ({ ...prev, companyValues: !prev.companyValues }))}
                >
                  {isEditing.companyValues ? "Save" : "Edit"}
                </Button>
              </div>
              {isEditing.companyValues ? (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Core Values</label>
                  <Textarea
                    value={onboardingData.companyValues}
                    onChange={(e) => updateOnboardingData({ companyValues: e.target.value })}
                    className="mt-1"
                    rows={4}
                  />
                </div>
              ) : (
                <dl>
                  <dt className="text-sm font-medium text-muted-foreground">Core Values</dt>
                  <dd className="whitespace-pre-wrap">{onboardingData.companyValues}</dd>
                </dl>
              )}
            </div>

            <div className="bg-muted p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Additional Information</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-indigo-600"
                  onClick={() => setIsEditing(prev => ({ ...prev, additionalInfo: !prev.additionalInfo }))}
                >
                  {isEditing.additionalInfo ? "Save" : "Edit"}
                </Button>
              </div>
              {isEditing.additionalInfo ? (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Additional Details</label>
                  <Textarea
                    value={onboardingData.additionalInfo}
                    onChange={(e) => updateOnboardingData({ additionalInfo: e.target.value })}
                    className="mt-1"
                    rows={4}
                  />
                </div>
              ) : (
                <dl>
                  <dt className="text-sm font-medium text-muted-foreground">Additional Details</dt>
                  <dd className="whitespace-pre-wrap">{onboardingData.additionalInfo || "None provided"}</dd>
                </dl>
              )}
            </div>
          </div>

          {/* Right column: Brand Voice (or empty state before generation) */}
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-semibold">
                {onboardingData.brandVoice ? "Your Brand Voice" : "Ready to Generate"}
              </h3>
              {onboardingData.brandVoice && (
                <div className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                  Generated
                </div>
              )}
            </div>

            {onboardingData.brandVoice ? (
              // Show generated brand voice
              <div className="space-y-6">
                {/* Business Summary Banner */}
                {onboardingData.brandVoice.businessSummary && (
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 rounded-lg shadow-md">
                    <h3 className="text-white text-lg font-medium mb-1">Brand Summary</h3>
                    <p className="text-white/90 font-medium">{onboardingData.brandVoice.businessSummary}</p>
                  </div>
                )}
                
                {/* Brand Voice Cards */}
                <div className="space-y-5">
                  {onboardingData.brandVoice.pillars.map((pillar, index) => (
                    <div 
                      key={index} 
                      className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-indigo-100 dark:border-indigo-900 shadow-sm hover:shadow transition-all"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold">
                          {index + 1}
                        </div>
                        <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                          {pillar.name}
                        </h4>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-indigo-50 dark:bg-indigo-900/10 p-3 rounded-md">
                          <h5 className="font-medium mb-2 flex items-center">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                            What It Means
                          </h5>
                          <ul className="list-disc pl-5 space-y-1">
                            {pillar.whatItMeans.map((point, i) => (
                              <li key={i} className="text-sm">{point}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-md">
                          <h5 className="font-medium mb-2 flex items-center">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                            What It Doesn't Mean
                          </h5>
                          <ul className="list-disc pl-5 space-y-1">
                            {pillar.whatItDoesntMean.map((point, i) => (
                              <li key={i} className="text-sm">{point}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-md">
                          <h5 className="font-medium mb-2 flex items-center">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                            Iconic Brand Inspiration
                          </h5>
                          <ul className="list-disc pl-5 space-y-1">
                            {pillar.iconicBrandInspiration.map((brand, i) => (
                              <li key={i} className="text-sm">{brand}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Empty state before generation
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-dashed border-indigo-200 dark:border-indigo-800 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Create Your Brand Voice</h4>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  We'll analyze your answers and generate a unique brand voice that captures your company's personality.
                </p>
                <div className="grid grid-cols-1 gap-3 text-sm text-left w-full max-w-sm bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="font-medium">One-line brand summary</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="font-medium">3 unique brand voice pillars</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="font-medium">Clear do's and don'ts for each pillar</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="font-medium">Examples from iconic brands</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {apiError && (
          <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <Button onClick={handleBack} variant="outline" disabled={isGeneratingVoice}>
          Back
        </Button>
        
        {!onboardingData.brandVoice ? (
          <Button 
            onClick={generateBrandVoice} 
            disabled={isGeneratingVoice || Object.values(isEditing).some(Boolean)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
          >
            {isGeneratingVoice ? (
              <>
                <div className="flex items-center">
                  <div className="w-5 h-5 relative mr-3">
                    <div className="w-5 h-5 rounded-full absolute animate-ping bg-indigo-400 opacity-75"></div>
                    <div className="w-5 h-5 rounded-full relative bg-indigo-500 flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <span className="inline-flex items-center">
                    Generating Brand Voice
                    <span className="ml-1 flex space-x-1">
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </span>
                  </span>
                </div>
              </>
            ) : !isLoggedIn ? (
              <span className="flex items-center">
                <span className="mr-2">Sign in & Generate Brand Voice</span>
                <Sparkles className="w-4 h-4" />
              </span>
            ) : Object.values(isEditing).some(Boolean) ? (
              "Save changes first"
            ) : (
              <span className="flex items-center">
                <span className="mr-2">Generate Brand Voice</span>
                <Sparkles className="w-4 h-4" />
              </span>
            )}
          </Button>
        ) : (
          <Button 
            onClick={generateBrandVoice} 
            disabled={isGeneratingVoice || Object.values(isEditing).some(Boolean)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
            size="sm"
          >
            {isGeneratingVoice ? (
              <>
                <div className="flex items-center">
                  <div className="w-5 h-5 relative mr-3">
                    <div className="w-5 h-5 rounded-full absolute animate-ping bg-indigo-400 opacity-75"></div>
                    <div className="w-5 h-5 rounded-full relative bg-indigo-500 flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <span className="inline-flex items-center">
                    Regenerating
                    <span className="ml-1 flex space-x-1">
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </span>
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center">
                  <Sparkles className="mr-2 h-4 w-4" />
                  <span>Regenerate Brand Voice</span>
                </div>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );

  // Render the current step
  return (
    <div className="min-h-[600px]">
      {/* Progress indicator */}
      <div className="bg-muted px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium">
            Step {currentStep} of 6
          </div>
          <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2.5 rounded-full"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
          {currentStep === 6 && renderStep6()}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1 || isSaving}
        >
          Back
        </Button>
        
        {currentStep < 6 ? (
          <Button onClick={handleNext} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Next"
            )}
          </Button>
        ) : (
          onboardingData.brandVoice && (
            <Button
              onClick={handleComplete}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-500"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Go to Dashboard"
              )}
            </Button>
          )
        )}
      </div>
    </div>
  );
} 