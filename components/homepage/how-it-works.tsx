"use client";
import { motion } from "motion/react";
import { Sparkles, MessageSquare, Zap } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Tell us about your brand",
      description: "Answer a few questions about your business. No, we won't ask for your life story—just the good stuff that makes your brand tick.",
      icon: Sparkles,
      color: "bg-indigo-500/10 text-indigo-500",
    },
    {
      id: 2,
      title: "Get your brand voice",
      description: "Our AI builds your unique voice profile in minutes. It's like having a copywriter who actually remembers your brand guidelines.",
      icon: MessageSquare,
      color: "bg-pink-500/10 text-pink-500",
    },
    {
      id: 3,
      title: "Create on-brand content",
      description: "Generate blogs, emails, social posts—all in your voice. No more sounding like a corporate robot or a ChatGPT clone.",
      icon: Zap,
      color: "bg-amber-500/10 text-amber-500",
    },
  ];

  return (
    <section className="py-24 px-4 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          {/* Pill badge */}
          <div className="mx-auto w-fit rounded-full border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-1 mb-6">
            <div className="flex items-center gap-2 text-sm font-medium text-indigo-900 dark:text-indigo-200">
              <Zap className="h-4 w-4" />
              <span>Simple Process</span>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 dark:from-white dark:via-indigo-300 dark:to-white pb-2">
            How Choir Works
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
            No 37-step process here. Just three simple steps to get your brand voice singing in perfect harmony.
          </p>
        </div>

        {/* Steps - Vertical Layout */}
        <div className="max-w-3xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-[28px] top-8 bottom-8 w-1 bg-indigo-200 dark:bg-indigo-800/50 rounded-full"></div>
          
          {/* Steps */}
          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex items-start gap-8"
              >
                {/* Step Number with Icon */}
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 border-2 border-indigo-500 dark:border-indigo-400 flex items-center justify-center z-10 relative shadow-md">
                    <step.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    {step.id}
                  </div>
                </div>
                
                {/* Content */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700 flex-1">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 