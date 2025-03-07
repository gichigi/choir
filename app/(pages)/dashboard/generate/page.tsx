"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ArrowLeft, Save, Copy, Download, Image, Quote, User, Tag, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import ReactMarkdown from 'react-markdown';

// Fallback content in case the API fails
const generateFallbackContent = (topic: string, contentType: string) => {
  return `# ${topic}

This is a fallback ${contentType} about ${topic}. Our AI content generation service is currently experiencing issues, but we've created this basic content for you.

## Key Points

- This is a placeholder for your ${contentType} about ${topic}
- You can edit this content to better match your needs
- When our AI service is back online, you'll be able to generate more tailored content

## Next Steps

1. Edit this content to better suit your needs
2. Try generating content again later
3. Contact support if the issue persists

Thank you for your patience!`;
};

export default function GenerateContentPage() {
  const searchParams = useSearchParams();
  const initialContentType = searchParams.get("contentType") || "blog post";
  const initialLength = searchParams.get("length") || "medium";
  const initialTopic = searchParams.get("topic") || "";
  
  const [contentType, setContentType] = useState(initialContentType);
  const [topic, setTopic] = useState(initialTopic);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [readingAge, setReadingAge] = useState(16);
  const [wordCount, setWordCount] = useState(initialLength === "short" ? 300 : initialLength === "medium" ? 600 : 1200);
  const [includeImages, setIncludeImages] = useState(false);
  const [includeQuotes, setIncludeQuotes] = useState(false);
  const [includeByline, setIncludeByline] = useState(false);
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  // Get the user's brand voice from Convex
  const brandVoice = useQuery(api.brandVoices.getUserBrandVoice);
  
  // Convex mutation for saving content
  const saveContent = useMutation(api.content.createContent);
  
  // Update word count when length changes
  useEffect(() => {
    if (initialLength === "short") {
      setWordCount(300);
    } else if (initialLength === "medium") {
      setWordCount(600);
    } else if (initialLength === "long") {
      setWordCount(1200);
    }
  }, [initialLength]);
  
  const handleGenerate = async () => {
    if (!topic) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic for your content.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    setGeneratedContent("");
    setApiError(null);
    
    try {
      // Call the OpenAI API to generate content
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType,
          topic,
          wordCount,
          readingAge,
          includeImages,
          includeQuotes,
          includeByline,
          additionalDetails,
          tags: selectedTags,
          brandVoice,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate content');
      }
      
      const data = await response.json();
      
      if (!data.content) {
        throw new Error('No content was generated');
      }
      
      setGeneratedContent(data.content);
      
      // Extract a title from the first line if it starts with # or ##
      const lines = data.content.split('\n');
      if (lines[0].startsWith('# ')) {
        setTitle(lines[0].substring(2));
      } else if (lines[0].startsWith('## ')) {
        setTitle(lines[0].substring(3));
      } else {
        // Use the topic as the title if no heading is found
        setTitle(topic);
      }
    } catch (error: any) {
      console.error("Error generating content:", error);
      setApiError(error.message || "Failed to generate content");
      
      // Use fallback content
      toast({
        title: "Using fallback content",
        description: "We encountered an issue with the AI service. Using basic content instead.",
        variant: "warning",
      });
      
      const fallbackContent = generateFallbackContent(topic, contentType);
      setGeneratedContent(fallbackContent);
      setTitle(topic);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSaveContent = async () => {
    if (!generatedContent || !brandVoice) {
      toast({
        title: "Cannot Save",
        description: "Please generate content first or ensure you have a brand voice.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await saveContent({
        brandVoiceId: brandVoice._id,
        title: title || topic,
        type: contentType,
        content: generatedContent,
        tags: selectedTags,
        metadata: {
          readingLevel: readingAge.toString(),
          tone: "default",
          length: wordCount.toString(),
          targetAudience: additionalDetails,
        },
      });
      
      toast({
        title: "Content Saved",
        description: "Your content has been saved to your library.",
      });
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        title: "Save Failed",
        description: "Failed to save content. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleCopyContent = () => {
    if (!generatedContent) return;
    
    navigator.clipboard.writeText(generatedContent)
      .then(() => {
        toast({
          title: "Copied to Clipboard",
          description: "Content has been copied to your clipboard.",
        });
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
        toast({
          title: "Copy Failed",
          description: "Failed to copy content to clipboard.",
          variant: "destructive",
        });
      });
  };
  
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex items-center mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-2xl font-bold ml-4">Generate {contentType.charAt(0).toUpperCase() + contentType.slice(1)}</h1>
      </div>
      
      {apiError && (
        <div className="mb-6 p-4 border border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
          <div>
            <p className="font-medium text-yellow-800 dark:text-yellow-200">API Error</p>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm">{apiError}</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parameters Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Parameters</CardTitle>
              <CardDescription>Customize your content generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contentType">Content Type</Label>
                <Select 
                  defaultValue={contentType}
                  onValueChange={(value) => setContentType(value)}
                >
                  <SelectTrigger id="contentType">
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
                <Label htmlFor="topic">Topic</Label>
                <Input 
                  id="topic" 
                  placeholder="Enter your topic" 
                  value={topic} 
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="wordCount">Word Count: {wordCount}</Label>
                </div>
                <Slider 
                  id="wordCount"
                  min={100} 
                  max={2000} 
                  step={50} 
                  value={[wordCount]} 
                  onValueChange={(value) => setWordCount(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="readingAge">Reading Age: {readingAge}</Label>
                </div>
                <Slider 
                  id="readingAge"
                  min={8} 
                  max={24} 
                  step={1} 
                  value={[readingAge]} 
                  onValueChange={(value) => setReadingAge(value[0])}
                />
              </div>
              
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="includeImages" className="cursor-pointer">Include Image Suggestions</Label>
                  <Switch 
                    id="includeImages" 
                    checked={includeImages} 
                    onCheckedChange={setIncludeImages}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="includeQuotes" className="cursor-pointer">Include Quotes</Label>
                  <Switch 
                    id="includeQuotes" 
                    checked={includeQuotes} 
                    onCheckedChange={setIncludeQuotes}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="includeByline" className="cursor-pointer">Include Byline</Label>
                  <Switch 
                    id="includeByline" 
                    checked={includeByline} 
                    onCheckedChange={setIncludeByline}
                  />
                </div>
              </div>
              
              <div className="space-y-2 pt-2">
                <Label htmlFor="additionalDetails">Additional Details</Label>
                <Textarea 
                  id="additionalDetails" 
                  placeholder="Add any additional details or context..." 
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                onClick={handleGenerate}
                disabled={isGenerating || !brandVoice}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : !brandVoice ? "Brand Voice Required" : "Generate Content"}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Organize your content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["Marketing", "Product", "Announcement", "Tutorial", "Case Study"].map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (selectedTags.includes(tag)) {
                        setSelectedTags(selectedTags.filter(t => t !== tag));
                      } else {
                        setSelectedTags([...selectedTags, tag]);
                      }
                    }}
                    className={selectedTags.includes(tag) ? "bg-indigo-600 hover:bg-indigo-700" : ""}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Content Preview */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Content Preview</CardTitle>
              <CardDescription>
                {isGenerating ? "Generating content..." : generatedContent ? "Your generated content" : "Content will appear here after generation"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-auto">
              {isGenerating ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
                    <p className="text-lg font-medium">Generating your content...</p>
                    <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
                  </div>
                </div>
              ) : generatedContent ? (
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{generatedContent}</ReactMarkdown>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center p-6">
                  <div>
                    <p className="text-lg font-medium mb-2">Ready to create content?</p>
                    <p className="text-sm text-muted-foreground">
                      Set your parameters and click "Generate Content" to get started.
                      {!brandVoice && (
                        <span className="block mt-2 text-amber-600 dark:text-amber-400">
                          Note: You need to create a brand voice first. Go to the onboarding process to create one.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            {generatedContent && (
              <CardFooter className="border-t flex justify-between pt-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopyContent}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSaveContent}>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
                <div>
                  <Button variant="default" size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
} 