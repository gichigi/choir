"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Activity, Code, MessageSquare, Sparkles, TrendingUp, Users, Wand2, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [contentType, setContentType] = useState("blog post");
  const [contentLength, setContentLength] = useState("medium");
  const [topic, setTopic] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Redirect to the generate page with the form data as query parameters
    setTimeout(() => {
      router.push(`/dashboard/generate?contentType=${encodeURIComponent(contentType)}&length=${contentLength}&topic=${encodeURIComponent(topic)}`);
    }, 500);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your Choir dashboard.
        </p>
      </div>

      {/* Content Creation Card */}
      <Card className="border-indigo-100 dark:border-indigo-900 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardTitle className="text-2xl">Create On-Brand Content</CardTitle>
          <CardDescription className="text-indigo-100">
            Generate content that matches your unique brand voice
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="contentType" className="text-sm font-medium">
                  I want to create a
                </label>
                <Select 
                  value={contentType} 
                  onValueChange={setContentType}
                >
                  <SelectTrigger id="contentType" className="h-12">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blog post">Blog Post</SelectItem>
                    <SelectItem value="linkedin post">LinkedIn Post</SelectItem>
                    <SelectItem value="twitter post">Twitter Post</SelectItem>
                    <SelectItem value="tweet thread">Tweet Thread</SelectItem>
                    <SelectItem value="email newsletter">Email Newsletter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="contentLength" className="text-sm font-medium">
                  that is
                </label>
                <Select 
                  value={contentLength} 
                  onValueChange={setContentLength}
                >
                  <SelectTrigger id="contentLength" className="h-12">
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="topic" className="text-sm font-medium">
                about
              </label>
              <Textarea 
                id="topic" 
                placeholder="Enter your topic or brief description..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="h-24 resize-none"
                required
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-12 text-lg"
                disabled={isSubmitting || !topic.trim()}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate
                  </span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Brand Voice Section */}
      <Card className="border-indigo-100 dark:border-indigo-900">
        <CardHeader className="bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-900">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Brand Voice</CardTitle>
              <CardDescription>
                Your unique 3-pillar brand voice profile
              </CardDescription>
            </div>
            <Wand2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-lg border border-indigo-100 dark:border-indigo-900">
              <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                1. Simplicity
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Use plain English and avoid jargon or unnecessary complexity. Short, punchy sentences that get straight to the point.
              </p>
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" className="text-indigo-600 dark:text-indigo-400">
                  View Details
                </Button>
              </div>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-lg border border-indigo-100 dark:border-indigo-900">
              <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                2. Transparency
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Talk like a human—be honest, open, and inclusive. Break the "fourth wall" when appropriate.
              </p>
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" className="text-indigo-600 dark:text-indigo-400">
                  View Details
                </Button>
              </div>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-lg border border-indigo-100 dark:border-indigo-900">
              <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                3. Playful Sarcasm/Irony
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Lighthearted wit that teases and amuses without disrespecting the reader. Occasional humor to stand out.
              </p>
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" className="text-indigo-600 dark:text-indigo-400">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Content Generated</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              +2 from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Brand Consistency</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground mt-1">
              +5% increase
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.5 hrs</div>
            <p className="text-xs text-muted-foreground mt-1">
              This month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Content Types</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground mt-1">
              Blog, Social, Email, Web
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Content */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle>Recent Content</CardTitle>
            <CardDescription>
              Content you've generated recently
            </CardDescription>
          </div>
          <Link href="/dashboard/content">
            <Button variant="outline">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                title: "Blog Post: 10 Ways to Improve Your Marketing Strategy",
                description: "A comprehensive guide to modern marketing techniques.",
                time: "2 hours ago"
              },
              {
                title: "Social Media Post: Product Launch Announcement",
                description: "Announcing our new feature with engaging copy.",
                time: "1 day ago"
              },
              {
                title: "Email Newsletter: Monthly Update",
                description: "Recap of this month's achievements and upcoming events.",
                time: "3 days ago"
              }
            ].map((content, i) => (
              <div key={i} className="flex justify-between gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <div>
                  <p className="text-sm font-medium">{content.title}</p>
                  <p className="text-sm text-muted-foreground">{content.description}</p>
                </div>
                <p className="text-xs text-muted-foreground whitespace-nowrap">{content.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Ideas */}
      <Card>
        <CardHeader>
          <CardTitle>Content Ideas</CardTitle>
          <CardDescription>AI-suggested content ideas based on your brand voice</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                title: "How Our Transparent Approach Benefits Customers",
                description: "A blog post highlighting your transparency pillar with real examples.",
                time: "Blog Post"
              },
              {
                title: "Simple Explanations for Complex Topics in Your Industry",
                description: "A series of social posts breaking down difficult concepts.",
                time: "Social Media"
              },
              {
                title: "Behind the Scenes: Our Process Explained",
                description: "An email newsletter with a touch of playful commentary.",
                time: "Email"
              }
            ].map((idea, i) => (
              <div key={i} className="flex justify-between gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <div>
                  <p className="text-sm font-medium">{idea.title}</p>
                  <p className="text-sm text-muted-foreground">{idea.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{idea.time}</span>
                  <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
                    Use
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
