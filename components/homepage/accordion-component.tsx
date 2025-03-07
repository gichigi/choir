"use client"
import { HelpCircle } from "lucide-react"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { motion } from "motion/react"

const faqs = [
    {
        question: "Is Choir just another AI writing tool?",
        answer: "Nope. While other AI tools spit out generic content that sounds like everyone else's, Choir actually captures your unique brand voice. It's the difference between a custom suit and something off the rack that kinda-sorta fits if you squint."
    },
    {
        question: "How long does it take to create a brand voice?",
        answer: "About 5 minutes, which is roughly 295 minutes faster than your typical brand workshop. Answer a few questions about your business, and our AI does the heavy lifting. No sticky notes, group exercises, or overpriced consultants required."
    },
    {
        question: "Can I customize the content Choir generates?",
        answer: "Absolutely! Unlike other AI tools where you're stuck playing the reprompting game, Choir lets you adjust reading level, tone, length, and more. Control freaks, rejoice—we built this for you."
    },
    {
        question: "Will my customers know the content was AI-generated?",
        answer: "Not unless you tell them. Choir content doesn't have that robotic 'I was written by AI' vibe. It actually sounds like a human who knows your brand wrote it—because that's exactly what we trained it to do."
    },
    {
        question: "Do you offer a free trial?",
        answer: "Yes! Our free plan lets you create one brand voice and generate up to 10 pieces of content per month. No credit card required, no surprise charges, no 'oops we forgot to tell you the trial ended' moments."
    },
    {
        question: "How is Choir different from using ChatGPT?",
        answer: "ChatGPT is like a Swiss Army knife—good at lots of things, master of none. Choir is a specialized tool built specifically for brand voice and content creation. Plus, we don't make you rewrite the same prompt 17 times to get what you want."
    }
]

export function AccordionComponent() {
    return (
        <section className="py-24 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    {/* Pill badge */}
                    <div className="mx-auto w-fit rounded-full border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/30 px-4 py-1 mb-6">
                        <div className="flex items-center gap-2 text-sm font-medium text-blue-900 dark:text-blue-200">
                            <HelpCircle className="h-4 w-4" />
                            <span>Questions You Might Have</span>
                        </div>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-white dark:via-blue-300 dark:to-white pb-2">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
                        Still have questions? We've got answers. And if you don't see what you're looking for, our support team actually responds (shocking, we know).
                    </p>
                </div>

                {/* Accordion */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index + 1}`}
                                className="border border-gray-200 dark:border-gray-800 rounded-lg mb-4 px-2"
                            >
                                <AccordionTrigger className="hover:no-underline py-4 px-2">
                                    <span className="font-medium text-left text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        {faq.question}
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="px-2 pb-4">
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {faq.answer}
                                    </p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>
            </div>
        </section>
    )
}
