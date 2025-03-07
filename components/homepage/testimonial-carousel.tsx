"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Quote, Star } from "lucide-react";
import Image from "next/image";

export default function TestimonialCarousel() {
  const testimonials = [
    {
      quote: "I used to spend hours trying to make our content sound consistent. Now I just click a button and Choir does it for me. It's like having a clone of myself, but without the existential crisis.",
      author: "Sarah Johnson",
      title: "Content Director at TechFlow",
      avatar: "/avatars/avatar-1.png",
      initials: "SJ",
    },
    {
      quote: "Our marketing team was skeptical about AI content tools. Then Choir came along and proved that AI can actually sound like us—not like a robot trying to pass a Turing test.",
      author: "Michael Chen",
      title: "CMO at Brightwave",
      avatar: "/avatars/avatar-2.png",
      initials: "MC",
    },
    {
      quote: "I've tried every AI writing tool out there. Most of them sound like they're reading from the same generic script. Choir actually captures our brand's personality. It's almost scary how good it is.",
      author: "Alex Rivera",
      title: "Founder of Spark Digital",
      avatar: "/avatars/avatar-3.png",
      initials: "AR",
    },
    {
      quote: "Our copywriters used to dread creating social media content. Now they actually look forward to it. Choir takes care of the heavy lifting while they focus on strategy. Win-win.",
      author: "Priya Patel",
      title: "Social Media Manager at Elevate",
      avatar: "/avatars/avatar-4.png",
      initials: "PP",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("forward");
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance the carousel every 5 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (direction === "forward") {
        setCurrentIndex((prevIndex) => 
          prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
      } else {
        setCurrentIndex((prevIndex) => 
          prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
        );
      }
    }, 5000); // Slow movement - 5 seconds per testimonial

    return () => clearInterval(interval);
  }, [direction, isPaused, testimonials.length]);

  // Get visible testimonials
  const getVisibleTestimonials = () => {
    return [
      testimonials[currentIndex],
      testimonials[(currentIndex + 1) % testimonials.length],
    ];
  };

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          {/* Pill badge */}
          <div className="mx-auto w-fit rounded-full border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-1 mb-6">
            <div className="flex items-center gap-2 text-sm font-medium text-indigo-900 dark:text-indigo-200">
              <Star className="h-4 w-4" />
              <span>Happy Humans</span>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 dark:from-white dark:via-indigo-300 dark:to-white pb-2">
            Don't Just Take Our Word For It
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
            Real people, real results. No, we didn't pay them to say nice things. We're not that desperate.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div 
          className="relative max-w-5xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Testimonials */}
          <div className="flex flex-col md:flex-row gap-6">
            {getVisibleTestimonials().map((testimonial, index) => (
              <motion.div
                key={`${testimonial.author}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-gray-100 dark:border-gray-700 flex-1"
              >
                <div className="flex items-start mb-6">
                  <div className="mr-4 flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-medium">
                      {testimonial.initials}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.title}</p>
                  </div>
                </div>
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 h-6 w-6 text-indigo-200 dark:text-indigo-800" />
                  <p className="text-gray-600 dark:text-gray-300 pl-4">
                    "{testimonial.quote}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsPaused(true);
                  // Resume auto-play after 10 seconds of inactivity
                  setTimeout(() => setIsPaused(false), 10000);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-indigo-600 dark:bg-indigo-400 w-6"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 