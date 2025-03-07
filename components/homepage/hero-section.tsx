"use client";
import { ArrowRight, MessageSquare, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { motion } from "motion/react";

export default function HeroSection() {
  return (
    <section
      className="relative flex flex-col items-center justify-center py-20"
      aria-label="Choir Brand Voice Generator Hero"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-400 dark:bg-indigo-500 opacity-20 blur-[100px]"></div>
      </div>

      <div className="space-y-6 text-center max-w-4xl px-4">
        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-fit rounded-full border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-1 mb-6"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-indigo-900 dark:text-indigo-200">
            <Sparkles className="h-4 w-4" />
            <span>AI That Actually Sounds Like You</span>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 dark:from-white dark:via-indigo-300 dark:to-white animate-gradient-x pb-2"
        >
          Your Brand Voice, <br className="hidden sm:block" />
          Not A ChatGPT Clone
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
        >
          Let's be real—keeping your brand voice consistent is a full-time job. Choir captures what makes you sound like you, then generates content that doesn't scream "I was written by AI!"
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center items-center gap-4 pt-4"
        >
          <Link href="/onboarding">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-8 h-12"
            >
              Stop Sounding Generic
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <Link
            href="/pricing"
            aria-label="View pricing plans"
          >
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 h-12 border-2"
            >
              See Pricing
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>

          <Link
            href="#features"
            className="flex items-center gap-2 rounded-full px-6 py-2 h-12 border-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="See how it works"
          >
            <MessageSquare className="w-5 h-5" aria-hidden="true" />
            <span>How It Actually Works</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
