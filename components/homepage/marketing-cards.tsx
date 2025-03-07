"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const FeatureData = [
  {
    id: 1,
    name: "AI Style Guide That Actually Works",
    description:
      "No more 'this doesn't sound like us' feedback. Choir checks if your content matches your brand voice—and fixes it if it doesn't.",
    svg: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-check"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="m9 9.5 2 2 4-4"/></svg>
    `,
    url: "#features",
    color: "from-[#8B5CF6] to-[#C4B5FD]",
  },
  {
    id: 2,
    name: "Content That Doesn't Scream 'AI'",
    description:
      "Blogs, social posts, emails—all with your unique flair. No more generic AI content that sounds like everyone else's.",
    svg: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square-text"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M13 8H7"/><path d="M17 12H7"/></svg>
    `,
    url: "#features",
    color: "from-[#EC4899] to-[#F9A8D4]",
  },
  {
    id: 3,
    name: "5-Minute Brand Voice Setup",
    description:
      "Answer a few questions and you're done. It's like a brand workshop, minus the sticky notes and 8-hour meeting.",
    svg: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wand-sparkles"><path d="m6 12 6-6 6 6-6 6-6-6Z"/><path d="m2 22 3-3"/><path d="M18 3h3v3"/><path d="m22 2-5 5"/><path d="M2 12h2"/><path d="M12 2v2"/><path d="m19 9 3 3"/></svg>
    `,
    url: "#features",
    color: "from-[#3B82F6] to-[#93C5FD]",
  },
  {
    id: 4,
    name: "See Your Voice in Action",
    description:
      "Choir highlights exactly how your brand voice is applied in each piece of content. It's like X-ray vision for your brand identity.",
    svg: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
    `,
    url: "#features",
    color: "from-[#10B981] to-[#6EE7B7]",
  },
  {
    id: 5,
    name: "Content Library (No More Lost Docs)",
    description:
      "All your generated content in one place. No more digging through Google Docs, Slack messages, and 'where did I put that?' moments.",
    svg: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-library"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>
    `,
    url: "#features",
    color: "from-[#F59E0B] to-[#FCD34D]",
  },
  {
    id: 6,
    name: "Control Freaks Welcome",
    description:
      "Adjust reading level, tone, length, and more. Unlike ChatGPT, you won't need 17 reprompts to get what you actually want.",
    svg: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sliders-horizontal"><path d="M21 10H3"/><path d="M16 14H3"/><path d="M8 6H3"/><path d="M18 6h3"/><path d="M12 18H3"/><path d="M16 18h5"/><circle cx="18" cy="10" r="2"/><circle cx="13" cy="14" r="2"/><circle cx="10" cy="6" r="2"/><circle cx="16" cy="18" r="2"/></svg>
    `,
    url: "#features",
    color: "from-[#EF4444] to-[#FCA5A5]",
  },
];

export default function Features() {
  return (
    <section className="py-24 px-4" id="features">
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 dark:from-white dark:via-indigo-300 dark:to-white pb-2">
          Features That Actually Solve Problems
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
          No fluff, no empty promises—just tools that make your content sound like you, not like a robot having an identity crisis.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {FeatureData.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
              {/* Gradient Background */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300">
                <div
                  className={`h-full w-full bg-gradient-to-br ${feature.color}`}
                ></div>
              </div>

              <div className="relative z-10">
                {/* Logo and External Link */}
                <div className="flex items-center justify-between mb-4">
                  <div className="relative w-10 h-10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <div
                      className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full"
                      dangerouslySetInnerHTML={{ __html: feature.svg }}
                    />
                  </div>
                  <Link
                    href={feature.url}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <ArrowUpRight className="h-5 w-5" />
                  </Link>
                </div>

                {/* Content */}
                <Link href={feature.url} className="block">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
