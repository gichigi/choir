"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Twitter, Linkedin, Mail, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Choir</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              Your brand voice, amplified. No more sounding like a ChatGPT clone.
            </p>
            <div className="flex space-x-4 mt-6">
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" />
              </Link>
              <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" />
              </Link>
              <Link href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="h-5 w-5 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Links Columns */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/features" className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/onboarding" className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Stay in the loop</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Get tips, updates, and occasional dad jokes. No spam, we promise (we hate it as much as you do).
            </p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="email@example.com"
                className="max-w-[200px]"
              />
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Choir. All rights reserved. Made with ☕ and a healthy dose of sarcasm.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 