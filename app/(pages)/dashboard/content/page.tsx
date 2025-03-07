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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Eye, Search, Tag, Trash2 } from "lucide-react";
import Link from "next/link";

// Mock data for content items
const mockContentItems = [
  {
    id: "1",
    title: "10 Ways to Improve Your Marketing Strategy",
    type: "blog post",
    createdAt: "2023-06-15T10:30:00Z",
    tags: ["Marketing", "Strategy"],
    excerpt: "A comprehensive guide to modern marketing techniques that will help your business grow and reach new audiences.",
  },
  {
    id: "2",
    title: "Product Launch Announcement",
    type: "social media post",
    createdAt: "2023-06-10T14:45:00Z",
    tags: ["Product", "Announcement"],
    excerpt: "Exciting news! We're thrilled to announce the launch of our newest product that will revolutionize how you work.",
  },
  {
    id: "3",
    title: "Monthly Newsletter: June Updates",
    type: "email newsletter",
    createdAt: "2023-06-01T09:15:00Z",
    tags: ["Newsletter", "Updates"],
    excerpt: "Recap of this month's achievements, upcoming events, and important announcements for our valued customers.",
  },
  {
    id: "4",
    title: "How Our Transparent Approach Benefits Customers",
    type: "blog post",
    createdAt: "2023-05-28T11:20:00Z",
    tags: ["Transparency", "Customer Success"],
    excerpt: "A deep dive into how our commitment to transparency has built trust and loyalty with our customer base.",
  },
  {
    id: "5",
    title: "Behind the Scenes: Our Process Explained",
    type: "tweet thread",
    createdAt: "2023-05-20T16:10:00Z",
    tags: ["Process", "Behind the Scenes"],
    excerpt: "Ever wondered how we create our products? This thread takes you through our entire process from ideation to delivery.",
  },
];

export default function ContentLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  
  // Get unique tags from all content items
  const allTags = Array.from(
    new Set(mockContentItems.flatMap(item => item.tags))
  );
  
  // Filter content items based on search query, type, and tag
  const filteredContent = mockContentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || item.type === selectedType;
    const matchesTag = selectedTag === "all" || item.tags.includes(selectedTag);
    
    return matchesSearch && matchesType && matchesTag;
  });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
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
        <h1 className="text-2xl font-bold ml-4">Content Library</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
          <CardDescription>Browse and manage your generated content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="blog post">Blog Posts</SelectItem>
                <SelectItem value="social media post">Social Media Posts</SelectItem>
                <SelectItem value="tweet thread">Tweet Threads</SelectItem>
                <SelectItem value="email newsletter">Email Newsletters</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredContent.length} of {mockContentItems.length} items
            </p>
            <Link href="/dashboard/generate">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Create New Content
              </Button>
            </Link>
          </div>
          
          <Tabs defaultValue="grid" className="w-full">
            <div className="flex justify-end mb-4">
              <TabsList>
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="grid" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredContent.map(item => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className="capitalize mb-2">
                          {item.type}
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(item.createdAt)}
                        </div>
                      </div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {item.excerpt}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/dashboard/content/${item.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/dashboard/generate?edit=${item.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="list" className="mt-0">
              <div className="border rounded-md overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 bg-muted font-medium">
                  <div className="col-span-5">Title</div>
                  <div className="col-span-2">Type</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-2">Tags</div>
                  <div className="col-span-1">Actions</div>
                </div>
                
                {filteredContent.map(item => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 p-4 border-t items-center">
                    <div className="col-span-5 font-medium">{item.title}</div>
                    <div className="col-span-2 capitalize">{item.type}</div>
                    <div className="col-span-2 text-sm text-muted-foreground">
                      {formatDate(item.createdAt)}
                    </div>
                    <div className="col-span-2 flex flex-wrap gap-1">
                      {item.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="col-span-1 flex gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/content/${item.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/generate?edit=${item.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 