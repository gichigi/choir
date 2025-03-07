import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useToast } from '@/components/ui/use-toast';

export function useOnboardingRedirect() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { toast } = useToast();
  
  // Convex mutations and queries
  const saveUserData = useMutation(api.onboarding.saveOnboardingDataForUser);
  const createBrandVoice = useMutation(api.brandVoices.createBrandVoice);
  const getUserSubscription = useQuery(api.subscriptions.getUserSubscriptionStatus);
  
  useEffect(() => {
    const handlePendingOnboarding = async () => {
      if (isLoaded && isSignedIn) {
        // Check if there's a pending onboarding session
        const pendingSessionId = localStorage.getItem('pendingOnboardingSession');
        
        if (pendingSessionId) {
          // Check if user has an active subscription
          const subscriptionStatus = getUserSubscription;
          
          if (!subscriptionStatus?.hasActiveSubscription) {
            // Redirect to pricing page if no active subscription
            toast({
              title: "Subscription Required",
              description: "You need an active subscription to generate a brand voice. Please subscribe to continue.",
              variant: "destructive",
            });
            
            // Clear the pending session
            localStorage.removeItem('pendingOnboardingSession');
            
            // Redirect to pricing page
            router.push('/pricing');
            return;
          }
          
          try {
            // Get the session data from localStorage instead of trying to query it
            const storedData = localStorage.getItem('onboardingData');
            
            if (storedData) {
              const parsedData = JSON.parse(storedData);
              
              // Save the data for the user
              const onboardingDataId = await saveUserData({
                businessName: parsedData.businessName,
                yearFounded: parsedData.yearFounded,
                businessDescription: parsedData.businessDescription,
                website: parsedData.website || '',
                targetAudience: parsedData.targetAudience,
                companyValues: parsedData.companyValues,
                additionalInfo: parsedData.additionalInfo || '',
                sessionId: pendingSessionId,
              });
              
              // Check if there's brand voice data in localStorage
              if (parsedData.brandVoice) {
                // Create the brand voice
                await createBrandVoice({
                  onboardingDataId,
                  pillars: parsedData.brandVoice.pillars,
                });
              }
              
              // Clear the pending session
              localStorage.removeItem('pendingOnboardingSession');
              localStorage.removeItem('onboardingData');
              localStorage.removeItem('onboardingSessionId');
              
              // Redirect to dashboard
              router.push('/dashboard');
            }
          } catch (error) {
            console.error('Failed to handle pending onboarding:', error);
            toast({
              title: "Error",
              description: "Failed to process your onboarding data. Please try again.",
              variant: "destructive",
            });
          }
        }
      }
    };
    
    handlePendingOnboarding();
  }, [isLoaded, isSignedIn, router, saveUserData, createBrandVoice, getUserSubscription, toast]);
} 