"use client";

import { AccordionComponent } from "@/components/homepage/accordion-component";
import Pricing from "@/components/homepage/pricing";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { motion } from "framer-motion";
import { Check, DollarSign, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const router = useRouter();

  const features = [
    "Authentication & Authorization",
    "Payment Processing",
    "SEO Optimization",
    "TypeScript Support",
    "Database Integration",
    "Dark Mode Support",
    "Responsive Design",
    "API Integration",
  ];

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        {/* Back to onboarding button */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => router.push('/onboarding')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Brand Voice Creation
          </Button>
        </div>
        
        {/* Simplified header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Choose a Plan to Generate Your Brand Voice
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select a subscription to unlock your brand voice and start creating consistent, on-brand content.
          </p>
        </div>

        {/* Pricing component */}
        <div className="py-4">
          <Pricing />
        </div>
        
        {/* Additional information */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Why Subscribe?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="font-medium text-lg mb-2">Consistent Brand Voice</h3>
              <p>Maintain a consistent tone and style across all your marketing channels.</p>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="font-medium text-lg mb-2">Save Time</h3>
              <p>Generate on-brand content in seconds instead of spending hours writing.</p>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="font-medium text-lg mb-2">Stand Out</h3>
              <p>Differentiate your brand with a unique voice that resonates with your audience.</p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
