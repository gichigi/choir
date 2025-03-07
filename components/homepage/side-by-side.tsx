"use client"
import { MessageSquare, Sparkles, Wand2 } from 'lucide-react'
import { FaRegClock } from 'react-icons/fa'
import { OrbitingCirclesComponent } from './orbiting-circles'
import { motion } from "motion/react"

const features = [
  {
    name: 'Generate a Brand Voice in Minutes',
    description:
      'Answer a few quick questions about your business, and Choir crafts a unique voice profile that captures your brand essence.',
    icon: Wand2,
  },
  {
    name: 'Consistent Messaging Across Channels',
    description: 'Eliminate inconsistencies in your brand communication. Choir ensures your voice remains consistent across all marketing channels.',
    icon: MessageSquare,
  },
  {
    name: 'Save Time and Resources',
    description: 'Stop wasting hours manually enforcing style guidelines. Choir automates the process, letting you focus on strategy instead of execution.',
    icon: FaRegClock,
  },
]

export default function SideBySide() {
  return (
    <section className="py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-16 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:pr-8 lg:pt-4"
          >
            <div className="lg:max-w-lg">
              {/* Pill badge */}
              <div className="mb-6 w-fit rounded-full border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-1">
                <div className="flex items-center gap-2 text-sm font-medium text-indigo-900 dark:text-indigo-200">
                  <Sparkles className="h-4 w-4" />
                  <span>Why Choose Choir</span>
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 dark:from-white dark:via-indigo-300 dark:to-white pb-2">
                Your Brand Voice, Perfected
              </h2>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
                Choir captures your unique brand voice and helps you maintain consistency across all your content. No more diluted messaging or confused audiences.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                {features.map((feature, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    key={feature.name}
                    className="relative pl-12 group hover:bg-gray-50 dark:hover:bg-gray-800/50 p-4 rounded-xl transition-colors"
                  >
                    <dt className="inline font-semibold text-gray-900 dark:text-white">
                      <feature.icon
                        className="absolute left-3 top-5 h-6 w-6 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform"
                        aria-hidden="true"
                      />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline text-gray-600 dark:text-gray-300">{feature.description}</dd>
                  </motion.div>
                ))}
              </dl>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-background/5 to-background/0 z-10"></div>
              <OrbitingCirclesComponent />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
