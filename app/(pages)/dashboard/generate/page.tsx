"use client";

import { useState } from "react";
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
import { Loader2, ArrowLeft, Save, Copy, Download, Image, Quote, User, Tag } from "lucide-react";
import Link from "next/link";

export default function GenerateContentPage() {
  const searchParams = useSearchParams();
  const contentType = searchParams.get("contentType") || "blog post";
  const length = searchParams.get("length") || "medium";
  const topic = searchParams.get("topic") || "";
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [readingAge, setReadingAge] = useState(16);
  const [wordCount, setWordCount] = useState(length === "short" ? 300 : length === "medium" ? 600 : 1200);
  const [includeImages, setIncludeImages] = useState(false);
  const [includeQuotes, setIncludeQuotes] = useState(false);
  const [includeByline, setIncludeByline] = useState(false);
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate API call to generate content
    setTimeout(() => {
      const mockContent = `# ${topic}\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.\n\nNullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.\n\n## Key Points\n\n- Point 1: Important information here\n- Point 2: More critical details\n- Point 3: Final thoughts on the matter\n\nIn conclusion, this ${contentType} about ${topic} demonstrates the brand voice pillars of simplicity, transparency, and playful sarcasm while maintaining a professional tone suitable for your audience.`;
      
      setGeneratedContent(mockContent);
      setIsGenerating(false);
    }, 3000);
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
                <Select defaultValue={contentType}>
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
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="length">Length</Label>
                <Select defaultValue={length}>
                  <SelectTrigger id="length">
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                  </SelectContent>
                </Select>
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
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : "Generate Content"}
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
            <CardContent className="flex-grow">
              {isGenerating ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
                    <p className="text-lg font-medium">Generating your content...</p>
                    <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
                  </div>
                </div>
              ) : generatedContent ? (
                <Tabs defaultValue="preview" className="h-full flex flex-col">
                  <TabsList className="mb-4">
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                  </TabsList>
                  <TabsContent value="preview" className="flex-grow overflow-auto whitespace-pre-wrap p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
                    {generatedContent}
                  </TabsContent>
                  <TabsContent value="edit" className="flex-grow">
                    <Textarea 
                      value={generatedContent} 
                      onChange={(e) => setGeneratedContent(e.target.value)} 
                      className="h-full min-h-[400px] font-mono"
                    />
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="h-full flex items-center justify-center border-2 border-dashed rounded-md p-8">
                  <div className="text-center">
                    <p className="text-lg font-medium">No content generated yet</p>
                    <p className="text-sm text-muted-foreground mt-2">Adjust parameters and click Generate</p>
                  </div>
                </div>
              )}
            </CardContent>
            {generatedContent && (
              <CardFooter className="border-t flex justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
                <Button className="bg-green-600 hover:bg-green-700 gap-1">
                  <Save className="h-4 w-4" />
                  Save Content
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
} 