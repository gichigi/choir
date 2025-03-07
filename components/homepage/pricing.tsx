"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useAction, useQuery } from "convex/react";
import { CheckCircle2, DollarSign } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type PricingSwitchProps = {
  onSwitch: (value: string) => void;
};

type PricingCardProps = {
  user: any;
  isYearly?: boolean;
  title: string;
  monthlyPrice?: number;
  yearlyPrice?: number;
  description: string;
  features: string[];
  actionLabel: string;
  popular?: boolean;
  exclusive?: boolean;
};

const PricingHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <div className="text-center mb-10">
    {/* Pill badge */}
    <div className="mx-auto w-fit rounded-full border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/30 px-4 py-1 mb-6">
      <div className="flex items-center gap-2 text-sm font-medium text-blue-900 dark:text-blue-200">
        <DollarSign className="h-4 w-4" />
        <span>Simple Pricing</span>
      </div>
    </div>

    <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-white dark:via-blue-300 dark:to-white pb-2">
      {title}
    </h2>
    <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
      {subtitle}
    </p>
  </div>
);

const PricingSwitch = ({ onSwitch }: PricingSwitchProps) => (
  <div className="flex justify-center items-center gap-3">
    <Tabs defaultValue="0" className="w-[400px]" onValueChange={onSwitch}>
      <TabsList className="w-full">
        <TabsTrigger value="0" className="w-full">
          Monthly
        </TabsTrigger>
        <TabsTrigger value="1" className="w-full">
          Yearly (Save 30%)
        </TabsTrigger>
      </TabsList>
    </Tabs>
  </div>
);

const PricingCard = ({
  user,
  isYearly,
  title,
  monthlyPrice,
  yearlyPrice,
  description,
  features,
  actionLabel,
  popular,
  exclusive,
}: PricingCardProps) => {
  const router = useRouter();

  const getProCheckoutUrl = useAction(api.subscriptions.getProOnboardingCheckoutUrl);
  const subscriptionStatus = useQuery(api.subscriptions.getUserSubscriptionStatus);

  const handleCheckout = async (interval: "month" | "year") => {
    try {
      // Store the onboarding session ID if it exists
      const pendingSessionId = localStorage.getItem('pendingOnboardingSession');
      if (pendingSessionId) {
        // Keep it in localStorage so we can retrieve it after checkout
        localStorage.setItem('checkoutFromOnboarding', 'true');
      }
      
      const checkoutProUrl = await getProCheckoutUrl({
        interval
      });

      if (checkoutProUrl) {
        window.location.href = checkoutProUrl;
      }
    } catch (error) {
      console.error("Failed to get checkout URL:", error);
    }
  };

  return (
    <Card
      className={cn("w-full max-w-sm flex flex-col justify-between px-2 py-1", {
        "relative border-2 border-blue-500 dark:border-blue-400": popular,
        "shadow-2xl bg-gradient-to-b from-gray-900 to-gray-800 text-white":
          exclusive,
      })}
    >
      {popular && (
        <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-blue-500 dark:bg-blue-400 px-3 py-1">
          <p className="text-sm font-medium text-white">Most Popular</p>
        </div>
      )}

      <div>
        <CardHeader className="space-y-2 pb-4">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription
            className={cn("", {
              "text-gray-300": exclusive,
            })}
          >
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-4">
          <div className="flex items-baseline gap-1">
            <span
              className={cn("text-4xl font-bold", {
                "text-white": exclusive,
              })}
            >
              ${isYearly ? yearlyPrice : monthlyPrice}
            </span>
            <span
              className={cn("text-muted-foreground", {
                "text-gray-300": exclusive,
              })}
            >
              {isYearly ? "/yr" : "/mo"}
            </span>
          </div>

          <div className="mt-6 space-y-2">
            {features.map((feature) => (
              <div key={feature} className="flex gap-2">
                <CheckCircle2
                  className={cn("h-5 w-5 text-blue-500", {
                    "text-blue-400": exclusive,
                  })}
                />
                <p
                  className={cn("text-muted-foreground", {
                    "text-gray-300": exclusive,
                  })}
                >
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </div>

      <CardFooter>
        <Button
          onClick={() => {
            if (!user) {
              router.push("/sign-in");
              return;
            }
            handleCheckout(isYearly ? "year" : "month")
          }}
          className={cn("w-full", {
            "bg-blue-500 hover:bg-blue-400": popular,
            "bg-white text-gray-900 hover:bg-gray-100": exclusive,
          })}
        >
          {actionLabel}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function Pricing() {
  const [isYearly, setIsYearly] = useState<boolean>(false);
  const togglePricingPeriod = (value: string) =>
    setIsYearly(parseInt(value) === 1);
  const { user } = useUser();

  const plans = [
    {
      title: "Free",
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: "For individuals who want to try out brand voice generation.",
      features: [
        "1 brand voice profile",
        "10 content generations/month",
        "Basic customization options",
        "Email support (we actually reply)",
      ],
      actionLabel: "Start Free",
      popular: false,
    },
    {
      title: "Pro",
      monthlyPrice: 12,
      yearlyPrice: 99,
      description: "For serious content creators who need consistent brand messaging.",
      features: [
        "Unlimited brand voices",
        "Unlimited content generations",
        "Advanced customization controls",
        "Priority support (like, actual humans)",
        "Content library & organization",
      ],
      actionLabel: "Get Pro & Generate Brand Voice",
      popular: true,
    },
    {
      title: "Teams",
      monthlyPrice: 49,
      yearlyPrice: 490,
      description: "For teams who need to maintain brand consistency across departments.",
      features: [
        "Everything in Pro",
        "Team collaboration features",
        "Shared content library",
        "Brand voice consistency checks",
        "Dedicated account manager",
      ],
      actionLabel: "Level Up Your Team",
      exclusive: true,
    }
  ];

  return (
    <section className="py-8">
      <div className="container mx-auto">
        <PricingSwitch onSwitch={togglePricingPeriod} />
        
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 justify-center">
          {plans.map((plan) => (
            <PricingCard
              key={plan.title}
              user={user}
              isYearly={isYearly}
              title={plan.title}
              monthlyPrice={plan.monthlyPrice}
              yearlyPrice={plan.yearlyPrice}
              description={plan.description}
              features={plan.features}
              actionLabel={plan.actionLabel}
              popular={plan.popular}
              exclusive={plan.exclusive}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            All plans include a 14-day money-back guarantee. No questions asked.
          </p>
        </div>
      </div>
    </section>
  );
}
