"use client"
import PageWrapper from "@/components/wrapper/page-wrapper";
import { SignUp } from "@clerk/nextjs";
import { useOnboardingRedirect } from "@/hooks/use-onboarding-redirect";

export default function SignUpPage() {
    // Use the hook to handle onboarding redirect
    useOnboardingRedirect();
    
    return (
        <PageWrapper>
            <div className="flex min-w-screen justify-center my-[5rem]">
                <SignUp fallbackRedirectUrl="/" signInFallbackRedirectUrl="/dashboard" />
            </div>
        </PageWrapper>
    );
}