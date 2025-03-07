import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, Code, MessageSquare, Star, TrendingUp, Users, Wand2, Zap } from "lucide-react";
import Link from "next/link";

export default async function Dashboard() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your Choir dashboard.
        </p>
      </div>

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
        <CardFooter className="bg-gray-50 dark:bg-gray-800/50 border-t">
          <div className="flex justify-between items-center w-full">
            <Button variant="outline" className="gap-2">
              <Wand2 className="h-4 w-4" />
              Regenerate
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
              <MessageSquare className="h-4 w-4" />
              Generate Content
            </Button>
          </div>
        </CardFooter>
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
        <CardHeader>
          <CardTitle>Recent Content</CardTitle>
          <CardDescription>
            Content you've generated recently
          </CardDescription>
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
        <CardFooter>
          <Button variant="ghost" className="w-full">View All Content</Button>
        </CardFooter>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start gap-2">
              <Link href="/dashboard/content">
                <MessageSquare className="h-4 w-4" />
                New Content
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start gap-2">
              <Link href="/dashboard/analytics">
                <TrendingUp className="h-4 w-4" />
                View Analytics
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start gap-2">
              <Link href="/dashboard/settings">
                <Users className="h-4 w-4" />
                Invite Team
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
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
                <div key={i} className="flex justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">{idea.title}</p>
                    <p className="text-sm text-muted-foreground">{idea.description}</p>
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">{idea.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full">Generate More Ideas</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
