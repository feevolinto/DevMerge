import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Users, Calendar, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Helper function to get initials
function getInitials(name: string) {
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // CHANGED: Await params
  const { id } = await params;
  
  // Fetch the specific group
  const response = await fetch(`http://localhost:3000/api/groups/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    notFound(); // Show 404 page if group not found
  }

  const group = await response.json();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <Link href="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Groups
        </Button>
      </Link>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <CardTitle className="text-3xl">{group.title}</CardTitle>
                <CardDescription className="flex items-center gap-4 text-base">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Created by {group.creator.name}
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {group.members.length} members
                  </span>
                  {group.timeline && (
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {group.timeline}
                    </span>
                  )}
                </CardDescription>
              </div>
              <Button size="lg">Join Group</Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Tags */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {group.tags.map((tagItem: any) => (
                  <Badge key={tagItem.tag.id} variant="secondary" className="text-sm">
                    {tagItem.tag.name}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold mb-2">About This Project</h3>
              <p className="text-gray-700 leading-relaxed">{group.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Members Card */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members ({group.members.length})</CardTitle>
            <CardDescription>People working on this project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {group.members.map((member: any) => (
                <div key={member.id} className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={member.user.profileImage} />
                    <AvatarFallback>{getInitials(member.user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{member.user.name}</p>
                    <p className="text-sm text-gray-500">@{member.user.username}</p>
                  </div>
                  <Badge variant={member.role === "LEADER" ? "default" : "secondary"}>
                    {member.role}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button size="lg" className="flex-1">
            Join This Project
          </Button>
          <Button size="lg" variant="outline">
            Contact Leader
          </Button>
        </div>
      </div>
    </div>
  );
}