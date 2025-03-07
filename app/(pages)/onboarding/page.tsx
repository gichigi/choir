"use client";

import { OnboardingProvider } from "./onboarding-context";
import OnboardingForm from "./onboarding-form";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function OnboardingPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <Link href="/">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Choir
        </div>
      </div>
      
      <Card className="border-none shadow-lg">
        <CardContent className="p-0">
          <OnboardingProvider>
            <OnboardingForm />
          </OnboardingProvider>
        </CardContent>
      </Card>
    </div>
  );
} 