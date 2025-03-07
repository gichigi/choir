"use client";

import { useOnboarding } from "./onboarding-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function OnboardingForm() {
  const {
    currentStep,
    setCurrentStep,
    onboardingData,
    updateOnboardingData,
    isGeneratingVoice,
    setIsGeneratingVoice,
  } = useOnboarding();
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!onboardingData.businessName.trim()) {
        newErrors.businessName = "Business name is required";
      }
      if (!onboardingData.yearFounded.trim()) {
        newErrors.yearFounded = "Year founded is required";
      } else if (!/^\d{4}$/.test(onboardingData.yearFounded)) {
        newErrors.yearFounded = "Please enter a valid year (e.g., 2020)";
      }
    } else if (currentStep === 2) {
      if (!onboardingData.businessDescription.trim()) {
        newErrors.businessDescription = "Business description is required";
      }
    } else if (currentStep === 3) {
      if (!onboardingData.targetAudience.trim()) {
        newErrors.targetAudience = "Target audience is required";
      }
    } else if (currentStep === 4) {
      if (!onboardingData.companyValues.trim()) {
        newErrors.companyValues = "Company values are required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < 6) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateBrandVoice = async () => {
    setIsGeneratingVoice(true);
    
    // Simulate API call to generate brand voice
    setTimeout(() => {
      const mockBrandVoice = {
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
      
      updateOnboardingData({ brandVoice: mockBrandVoice });
      setIsGeneratingVoice(false);
    }, 3000);
  };

  const handleComplete = () => {
    // In a real app, you would save the data to the database here
    router.push("/dashboard");
  };

  return (
    <div className="p-6 md:p-10">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= step
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-500 dark:bg-gray-700"
              }`}
            >
              {step}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          ></div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Business Information</h2>
              <div className="space-y-4">
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
                    placeholder="e.g., Acme Corporation"
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
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Business Description</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="businessDescription" className="block text-sm font-medium mb-1">
                    What does your business do?
                  </label>
                  <Textarea
                    id="businessDescription"
                    value={onboardingData.businessDescription}
                    onChange={(e) =>
                      updateOnboardingData({ businessDescription: e.target.value })
                    }
                    placeholder="Describe your products, services, and mission..."
                    rows={6}
                    className={errors.businessDescription ? "border-red-500" : ""}
                  />
                  {errors.businessDescription && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessDescription}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Target Audience</h2>
              <div className="space-y-4">
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
                    placeholder="Describe your ideal customers, their demographics, interests, and pain points..."
                    rows={6}
                    className={errors.targetAudience ? "border-red-500" : ""}
                  />
                  {errors.targetAudience && (
                    <p className="text-red-500 text-sm mt-1">{errors.targetAudience}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Company Values</h2>
              <div className="space-y-4">
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
                    placeholder="List your core values and what they mean to your company..."
                    rows={6}
                    className={errors.companyValues ? "border-red-500" : ""}
                  />
                  {errors.companyValues && (
                    <p className="text-red-500 text-sm mt-1">{errors.companyValues}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Additional Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="additionalInfo" className="block text-sm font-medium mb-1">
                    Any additional information you'd like to share?
                  </label>
                  <Textarea
                    id="additionalInfo"
                    value={onboardingData.additionalInfo}
                    onChange={(e) =>
                      updateOnboardingData({ additionalInfo: e.target.value })
                    }
                    placeholder="Anything else that would help us understand your brand better..."
                    rows={6}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Review & Generate Brand Voice</h2>
              
              <div className="space-y-6 mb-8">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Business Information</h3>
                  <p><span className="font-medium">Name:</span> {onboardingData.businessName}</p>
                  <p><span className="font-medium">Founded:</span> {onboardingData.yearFounded}</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Business Description</h3>
                  <p>{onboardingData.businessDescription}</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Target Audience</h3>
                  <p>{onboardingData.targetAudience}</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Company Values</h3>
                  <p>{onboardingData.companyValues}</p>
                </div>
                
                {onboardingData.additionalInfo && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Additional Information</h3>
                    <p>{onboardingData.additionalInfo}</p>
                  </div>
                )}
              </div>
              
              {!onboardingData.brandVoice && !isGeneratingVoice && (
                <Button 
                  onClick={generateBrandVoice} 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  Generate Brand Voice
                </Button>
              )}
              
              {isGeneratingVoice && (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
                  <p className="text-lg">Generating your unique brand voice...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
                </div>
              )}
              
              {onboardingData.brandVoice && (
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <CheckCircle2 className="h-6 w-6" />
                    <span className="text-lg font-medium">Brand Voice Generated!</span>
                  </div>
                  
                  <div className="space-y-6">
                    {onboardingData.brandVoice.pillars.map((pillar, index) => (
                      <div key={index} className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg border border-indigo-200 dark:border-indigo-800">
                        <h3 className="text-xl font-bold mb-4 text-indigo-700 dark:text-indigo-300">
                          {index + 1}. {pillar.name}
                        </h3>
                        
                        <div className="mb-4">
                          <h4 className="font-medium mb-2 text-indigo-600 dark:text-indigo-400">What It Means</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {pillar.whatItMeans.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="font-medium mb-2 text-indigo-600 dark:text-indigo-400">What It Doesn't Mean</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {pillar.whatItDoesntMean.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2 text-indigo-600 dark:text-indigo-400">Iconic Brand Inspiration</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {pillar.iconicBrandInspiration.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={handleComplete} 
                    className="w-full bg-green-600 hover:bg-green-700 mt-4"
                  >
                    Continue to Dashboard
                  </Button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          Back
        </Button>
        
        {currentStep < 6 && (
          <Button onClick={handleNext}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
} 