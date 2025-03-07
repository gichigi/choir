"use client";

import { useState, useEffect } from "react";
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
import { ArrowLeft, Edit, Eye, Search, Tag, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { Id } from "@/convex/_generated/dataModel";

export default function ContentLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [isDeleting, setIsDeleting] = useState<Id<"content"> | null>(null);
  
  const { toast } = useToast();
  
  // Fetch content from Convex
  const contentResult = useQuery(api.content.getUserContent, {
    searchQuery: searchQuery || undefined,
    type: selectedType !== "all" ? selectedType : undefined,
    tags: selectedTag !== "all" ? [selectedTag] : undefined,
  });
  
  // Fetch content metadata (types and tags)
  const contentMetadata = useQuery(api.content.getUserContentMetadata);
  
  // Delete content mutation
  const deleteContent = useMutation(api.content.deleteContent);
  
  // Handle content deletion
  const handleDeleteContent = async (contentId: Id<"content">) => {
    try {
      setIsDeleting(contentId);
      await deleteContent({ contentId });
      toast({
        title: "Content Deleted",
        description: "The content has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting content:", error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  // Create excerpt from content
  const createExcerpt = (content: string, maxLength = 150) => {
    // Remove markdown formatting
    const plainText = content
      .replace(/#+\s/g, '') // Remove headings
      .replace(/\*\*/g, '') // Remove bold
      .replace(/\*/g, '') // Remove italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with just the text
      .replace(/!\[([^\]]+)\]\([^)]+\)/g, '') // Remove images
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/`([^`]+)`/g, '$1'); // Remove inline code
    
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  };
  
  // Loading state
  if (contentResult === undefined || contentMetadata === undefined) {
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
        
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
            <p className="text-lg font-medium">Loading your content...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Extract content items and metadata
  const contentItems = contentResult.content || [];
  const allTypes = contentMetadata.types || [];
  const allTags = contentMetadata.tags || [];
  
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
                {allTypes.map(type => (
                  <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                ))}
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
              {contentItems.length === 0 
                ? "No content found" 
                : `Showing ${contentItems.length} item${contentItems.length !== 1 ? 's' : ''}`}
            </p>
            <Link href="/dashboard/generate">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Create New Content
              </Button>
            </Link>
          </div>
          
          {contentItems.length === 0 ? (
            <div className="text-center py-12 border rounded-md">
              <p className="text-lg font-medium mb-2">No content found</p>
              <p className="text-sm text-muted-foreground mb-6">
                {searchQuery || selectedType !== "all" || selectedTag !== "all"
                  ? "Try adjusting your search or filters"
                  : "Start creating content to build your library"}
              </p>
              <Link href="/dashboard/generate">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Create Your First Content
                </Button>
              </Link>
            </div>
          ) : (
            <Tabs defaultValue="grid" className="w-full">
              <div className="flex justify-end mb-4">
                <TabsList>
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                  <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="grid" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contentItems.map(item => (
                    <Card key={item._id} className="overflow-hidden">
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
                          {createExcerpt(item.content)}
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
                            <Link href={`/dashboard/content/${item._id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/generate?edit=${item._id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteContent(item._id)}
                            disabled={isDeleting === item._id}
                          >
                            {isDeleting === item._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
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
                  
                  {contentItems.map(item => (
                    <div key={item._id} className="grid grid-cols-12 gap-4 p-4 border-t items-center">
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
                          <Link href={`/dashboard/content/${item._id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/dashboard/generate?edit=${item._id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteContent(item._id)}
                          disabled={isDeleting === item._id}
                        >
                          {isDeleting === item._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 