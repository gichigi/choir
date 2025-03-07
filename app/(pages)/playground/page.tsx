"use client";

import ModeToggle from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "ai/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  Bot,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Download,
  Share,
  Sparkles,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface Message {
  role: "user" | "assistant";
  content: string;
  reasoning?: string;
  timestamp: Date;
}

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function PlaygroundPage() {
  const [model, setModel] = useState("deepseek:deepseek-reasoner");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [expandedReasoning, setExpandedReasoning] = useState<number[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  // Content generation parameters
  const [contentType, setContentType] = useState("blog-post");
  const [wordCount, setWordCount] = useState(500);
  const [readingAge, setReadingAge] = useState(12);
  const [includeImages, setIncludeImages] = useState(false);
  const [includeQuotes, setIncludeQuotes] = useState(false);
  const [includeByline, setIncludeByline] = useState(false);
  const [additionalDetails, setAdditionalDetails] = useState("");

  // Model parameters
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(4000);
  const [topP, setTopP] = useState(0.9);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0.0);
  const [presencePenalty, setPresencePenalty] = useState(0.0);

  const toggleReasoning = (index: number) => {
    setExpandedReasoning((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleCopyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Build a system prompt that includes the brand voice and content parameters
  const buildFullSystemPrompt = () => {
    let fullPrompt = "You are a content creation assistant that writes in the brand voice of Choir. ";
    fullPrompt += "The brand voice has these pillars: Simplicity, Transparency, and Playful Sarcasm. ";
    
    // Add content generation parameters
    fullPrompt += `Create ${contentType.replace('-', ' ')} content `;
    fullPrompt += `that is approximately ${wordCount} words `;
    fullPrompt += `written at a reading level appropriate for age ${readingAge}. `;
    
    // Add toggles
    if (includeImages) fullPrompt += "Include image suggestions where appropriate. ";
    if (includeQuotes) fullPrompt += "Include relevant quotes to support key points. ";
    if (includeByline) fullPrompt += "Include a byline at the end. ";
    
    // Add any additional details
    if (additionalDetails) fullPrompt += `Additional requirements: ${additionalDetails}`;
    
    // Add any custom system prompt
    if (systemPrompt) fullPrompt += "\n\nAdditional instructions: " + systemPrompt;
    
    return fullPrompt;
  };

  const { messages, isLoading, input, handleInputChange, handleSubmit } =
    useChat({
      body: {
        model,
        temperature,
        maxTokens,
        topP,
        frequencyPenalty,
        presencePenalty,
        systemPrompt: buildFullSystemPrompt(),
        contentType,
        wordCount,
        readingAge,
        includeImages,
        includeQuotes,
        includeByline,
        additionalDetails
      },
    });
    

  const components = {
    code({ node, inline, className, children, ...props }: CodeProps) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : 'text';
      const code = String(children).replace(/\n$/, '');

      return !inline ? (
        <div className="relative rounded-lg overflow-hidden my-2">
          <div className="flex items-center justify-between px-4 py-2 bg-[#282C34] text-gray-200">
            <span className="text-xs font-medium">{language}</span>
            <button
              onClick={() => handleCopyCode(code)}
              className="hover:text-white transition-colors"
            >
              {copiedCode === code ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <SyntaxHighlighter
            style={oneDark}
            language={language}
            PreTag="div"
            className="!bg-[#1E1E1E] !m-0 !p-4 !rounded-b-lg"
          >
            {code}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5" {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen dark:bg-black bg-white dark:text-white text-black">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-[65vh] lg:h-screen">
        <header className="flex items-center justify-between py-3 px-4 border-b dark:border-zinc-800 border-zinc-200">
          <div className="flex items-center gap-3">
            <Link prefetch={true} href="/">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <h1 className="text-sm font-medium">Generate</h1>
              </div>
            </Link>
            <Badge
              variant="outline"
              className="text-xs dark:border-zinc-800 border-zinc-200"
            >
              {model?.split(":")[1] === "deepseek-reasoner" ? "deepseek-r" : model?.split(":")[1]}
            </Badge>
            
            {/* Brand voice badge */}
            <Badge
              className="text-xs bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-none"
            >
              Using Choir Brand Voice
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs dark:border-zinc-800 border-zinc-200 dark:hover:bg-zinc-900 hover:bg-zinc-100 hidden sm:inline-flex"
              onClick={() => {
                // Get the last assistant message
                const lastAssistantMessage = messages
                  .filter(m => m.role === "assistant")
                  .pop();
                
                if (lastAssistantMessage) {
                  navigator.clipboard.writeText(lastAssistantMessage.content);
                  toast({
                    title: "Copied to clipboard",
                    description: "Content has been copied to your clipboard",
                    duration: 2000
                  });
                }
              }}
            >
              <Copy className="w-3.5 h-3.5 mr-1.5" />
              Copy
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs dark:border-zinc-800 border-zinc-200 dark:hover:bg-zinc-900 hover:bg-zinc-100 hidden sm:inline-flex"
              onClick={() => {
                // Get the last assistant message
                const lastAssistantMessage = messages
                  .filter(m => m.role === "assistant")
                  .pop();
                
                if (lastAssistantMessage) {
                  // Create a blob from the content
                  const blob = new Blob([lastAssistantMessage.content], {type: 'text/plain'});
                  const url = URL.createObjectURL(blob);
                  
                  // Create an anchor element and trigger the download
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${contentType.replace('-', '_')}_${new Date().toISOString().split('T')[0]}.txt`;
                  document.body.appendChild(a);
                  a.click();
                  
                  // Clean up
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  
                  toast({
                    title: "Content exported",
                    description: "Your content has been exported as a text file",
                    duration: 2000
                  });
                }
              }}
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export
            </Button>
          </div>
        </header>

        <ScrollArea className="flex-1 p-4">
          <div className="max-w-3xl mx-auto space-y-6">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-start gap-3 ${
                    message.role === "assistant"
                      ? "flex-row"
                      : "flex-row-reverse"
                  }`}
                >
                  <div className="flex flex-col gap-2 max-w-[480px]">
                    {message.reasoning && (
                      <div
                        className={`${
                          message.role === "user"
                            ? "bg-[#007AFF] text-white"
                            : "bg-[#E9E9EB] dark:bg-[#1C1C1E] text-black dark:text-white"
                        } rounded-[20px] ${
                          message.role === "user"
                            ? "rounded-br-[8px]"
                            : "rounded-bl-[8px]"
                        }`}
                      >
                        <button
                          onClick={() => toggleReasoning(index)}
                          className="w-full flex items-center justify-between px-3 py-2"
                        >
                          <span className="text-xs font-medium opacity-70">
                            Reasoning
                          </span>
                          {expandedReasoning.includes(index) ? (
                            <ChevronUp className="w-3 h-3 opacity-70" />
                          ) : (
                            <ChevronDown className="w-3 h-3 opacity-70" />
                          )}
                        </button>
                        {expandedReasoning.includes(index) && (
                          <div className="px-3 pb-3 text-[12px] opacity-70">
                            <ReactMarkdown components={components}>
                              {message.reasoning}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    )}
                    {message.content && (
                      <div
                        className={`${
                          message.role === "user"
                            ? "bg-[#007AFF] text-white"
                            : "bg-[#E9E9EB] dark:bg-[#1C1C1E] text-black dark:text-white"
                        } rounded-[20px] ${
                          message.role === "user"
                            ? "rounded-br-[8px]"
                            : "rounded-bl-[8px]"
                        } px-3 py-2`}
                      >
                        <div className="text-[14px]">
                          <ReactMarkdown components={components}>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Only show loading when isLoading is true AND there's no message being streamed */}
            {isLoading &&
              messages[messages.length - 1]?.role !== "assistant" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 dark:bg-zinc-900/50 bg-white rounded-lg p-4"
                >
                  <div className="w-6 h-6 rounded-full border dark:border-zinc-800 border-zinc-200 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex gap-1 mt-[0.5rem]">
                      <span
                        className="w-2 h-2 rounded-full dark:bg-zinc-700 bg-zinc-200 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="w-2 h-2 rounded-full dark:bg-zinc-700 bg-zinc-200 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-2 h-2 rounded-full dark:bg-zinc-700 bg-zinc-200 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t dark:border-zinc-800 border-zinc-200">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Textarea
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="Send a message..."
                className="min-h-[60px] lg:min-h-[100px] bg-transparent dark:bg-zinc-900/50 bg-white border dark:border-zinc-800 border-zinc-200 focus:border-zinc-400 dark:focus:border-zinc-600"
              />
              <div className="absolute bottom-3 right-3">
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={isLoading || !input.trim()}
                  className="h-8 bg-white hover:bg-zinc-200 text-black"
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Sidebar */}
      <div className="h-[35vh] lg:h-screen lg:w-80 border-t lg:border-t-0 lg:border-l dark:border-zinc-800 border-zinc-200 dark:bg-black/50 bg-white backdrop-blur-sm">
        <div className="h-full">
          <Tabs defaultValue="parameters" className="h-full flex flex-col">
            <TabsList className="w-full dark:bg-zinc-900/50 bg-zinc-100 border dark:border-zinc-800 border-zinc-200">
              <TabsTrigger value="model" className="flex-1 text-xs sm:text-sm">
                Model
              </TabsTrigger>
              <TabsTrigger value="parameters" className="flex-1 text-xs sm:text-sm">
                Parameters
              </TabsTrigger>
              <TabsTrigger value="system" className="flex-1 text-xs sm:text-sm">
                Brand Voice
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto p-4">
              <TabsContent value="model" className="mt-0 space-y-4 h-full">
                <div>
                  <label className="text-xs dark:text-zinc-400 text-zinc-600 mb-2 block">
                    Model
                  </label>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger className="dark:bg-zinc-900/50 bg-white border dark:border-zinc-800 border-zinc-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai:gpt-4o">gpt-4o</SelectItem>
                      <SelectItem value="openai:gpt-4">gpt-4</SelectItem>
                      <SelectItem value="openai:gpt-3.5-turbo">
                        gpt-3.5 turbo
                      </SelectItem>
                      <SelectItem value="openai:gpt-4-turbo">
                        gpt-4 turbo
                      </SelectItem>
                      <SelectItem value="deepseek:deepseek-chat">
                        deepseek chat
                      </SelectItem>
                      <SelectItem value="deepseek:deepseek-coder">
                        deepseek coder
                      </SelectItem>
                      <SelectItem value="deepseek:deepseek-reasoner">
                        deepseek-r
                      </SelectItem>
                      <SelectItem value="groq:deepseek-r1-distill-llama-70b">
                        deepseek-r1-distill-llama-70b
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="parameters" className="mt-0 space-y-4 h-full">
                <div className="space-y-4">
                  {/* Content Type */}
                  <div>
                    <label className="text-xs dark:text-zinc-400 text-zinc-600 mb-2 block">
                      Content Type
                    </label>
                    <Select value={contentType} onValueChange={setContentType}>
                      <SelectTrigger className="dark:bg-zinc-900/50 bg-white border dark:border-zinc-800 border-zinc-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blog-post">Blog Post</SelectItem>
                        <SelectItem value="social-media">Social Media Post</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="newsletter">Newsletter</SelectItem>
                        <SelectItem value="product-description">Product Description</SelectItem>
                        <SelectItem value="landing-page">Landing Page Copy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Word Count */}
                  <div>
                    <label className="text-xs dark:text-zinc-400 text-zinc-600 mb-2 block">
                      Word Count ({wordCount} words)
                    </label>
                    <Slider
                      value={[wordCount]}
                      onValueChange={([value]) => setWordCount(value)}
                      min={100}
                      max={2000}
                      step={50}
                    />
                  </div>

                  {/* Reading Age */}
                  <div>
                    <label className="text-xs dark:text-zinc-400 text-zinc-600 mb-2 block">
                      Reading Age ({readingAge})
                    </label>
                    <Slider
                      value={[readingAge]}
                      onValueChange={([value]) => setReadingAge(value)}
                      min={8}
                      max={18}
                      step={1}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {readingAge <= 10 ? "Simple, accessible language" : 
                       readingAge <= 14 ? "Moderate complexity, suitable for general audience" :
                       "Advanced vocabulary and structure"}
                    </p>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs dark:text-zinc-400 text-zinc-600">
                        Include Image Suggestions
                      </label>
                      <Switch
                        checked={includeImages}
                        onCheckedChange={setIncludeImages}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-xs dark:text-zinc-400 text-zinc-600">
                        Include Quotes
                      </label>
                      <Switch
                        checked={includeQuotes}
                        onCheckedChange={setIncludeQuotes}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-xs dark:text-zinc-400 text-zinc-600">
                        Include Byline
                      </label>
                      <Switch
                        checked={includeByline}
                        onCheckedChange={setIncludeByline}
                      />
                    </div>
                  </div>
                  
                  {/* Additional Details */}
                  <div>
                    <label className="text-xs dark:text-zinc-400 text-zinc-600 mb-2 block">
                      Additional Details (optional)
                    </label>
                    <Textarea
                      placeholder="Add any specific details or requirements for the content..."
                      value={additionalDetails}
                      onChange={(e) => setAdditionalDetails(e.target.value)}
                      className="h-24 dark:bg-zinc-900/50 bg-white border dark:border-zinc-800 border-zinc-200"
                    />
                  </div>

                  <div className="border-t dark:border-zinc-800 border-zinc-200 my-4 pt-4">
                    <p className="text-xs text-muted-foreground mb-3">AI Model Settings</p>
                    <div>
                      <label className="text-xs dark:text-zinc-400 text-zinc-600 mb-2 block">
                        Creativity ({temperature.toFixed(1)})
                      </label>
                      <Slider
                        value={[temperature]}
                        onValueChange={([value]) => setTemperature(value)}
                        max={2}
                        step={0.1}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {temperature < 0.5 ? "More focused and deterministic" : 
                         temperature < 1.0 ? "Balanced creativity" :
                         "More varied and creative"}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="system" className="mt-0 space-y-4 h-full">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs dark:text-zinc-400 text-zinc-600">
                      Your Brand Voice
                    </label>
                    <Badge variant="outline" className="text-xs">Active</Badge>
                  </div>
                  
                  {/* Brand Voice Card */}
                  <div className="bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border border-indigo-100 dark:border-indigo-900 p-3 rounded-lg mb-4">
                    <div className="space-y-2">
                      {/* Brand summary */}
                      <div className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2">
                        A modern brand with a distinctive voice that blends simplicity, transparency, and playful wit to connect with audiences in an authentic way.
                      </div>
                      
                      {/* Pillars preview */}
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 hover:bg-indigo-200">
                          Simplicity
                        </Badge>
                        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 hover:bg-purple-200">
                          Transparency
                        </Badge>
                        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 hover:bg-amber-200">
                          Playful Sarcasm
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <label className="text-xs dark:text-zinc-400 text-zinc-600 mb-2 block">
                    Customize System Prompt (Optional)
                  </label>
                  <Textarea
                    placeholder="Enter a custom system prompt to override or enhance your brand voice instructions"
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    className="h-[150px] dark:bg-zinc-900/50 bg-white border dark:border-zinc-800 border-zinc-200"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Your brand voice is automatically applied to all generated content. Custom prompts should be used cautiously as they may override brand voice guidance.
                  </p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
