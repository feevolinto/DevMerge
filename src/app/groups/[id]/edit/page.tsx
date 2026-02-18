"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { use } from "react";

interface EditGroupPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditGroupPage({ params }: EditGroupPageProps) {
  // Unwrap params Promise
  const resolvedParams = use(params);
  const groupId = resolvedParams.id;
  
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeline, setTimeline] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Fetch group data on mount
  useEffect(() => {
    async function fetchGroup() {
      try {
        const response = await fetch(`/api/groups/${groupId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch group");
        }

        const group = await response.json();
        
        // Pre-fill form
        setTitle(group.title);
        setDescription(group.description);
        setTimeline(group.timeline || "");
        setTags(group.tags.map((t: any) => t.tag.name));
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
      }
    }

    fetchGroup();
  }, [groupId]);

  // Add a tag
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          timeline,
          tags,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update group");
      }

      // Success! Redirect to group page
      router.push(`/groups/${groupId}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Back Button */}
      <Link href={`/groups/${groupId}`}>
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Group
        </Button>
      </Link>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Edit Group</CardTitle>
          <CardDescription>
            Update your group information
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Project Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., AI Chatbot for Customer Service"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={100}
                disabled={isSaving}
              />
              <p className="text-sm text-gray-500">
                {title.length}/100 characters
              </p>
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your project..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={6}
                maxLength={2000}
                disabled={isSaving}
              />
              <p className="text-sm text-gray-500">
                {description.length}/2000 characters
              </p>
            </div>

            {/* Timeline Field */}
            <div className="space-y-2">
              <Label htmlFor="timeline">Timeline (Optional)</Label>
              <Input
                id="timeline"
                placeholder="e.g., 3 months, 6 weeks, ongoing"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                maxLength={100}
                disabled={isSaving}
              />
            </div>

            {/* Tags Field */}
            <div className="space-y-2">
              <Label htmlFor="tags">Technologies / Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  placeholder="e.g., React, Python, AI"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  disabled={isSaving}
                />
                <Button 
                  type="button" 
                  onClick={addTag} 
                  variant="secondary"
                  disabled={isSaving}
                >
                  Add
                </Button>
              </div>

              {/* Display Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                    >
                      {tag}
                      <X
                        className="ml-1 h-3 w-3"
                        onClick={() => !isSaving && removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-500">
                Press Enter or click Add to add tags
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="submit"
                size="lg"
                className="flex-1"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving changes...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
              <Link href={`/groups/${groupId}`} className="flex-1">
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="w-full"
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}