import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Users, Calendar, User, Settings } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JoinGroupButton } from "@/components/groups/join-group-button";
import { DeleteGroupButton } from "@/components/groups/delete-group-button";
import { getCurrentUser } from "@/lib/auth-helpers";

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
  const { id } = await params;
  
  // Fetch the specific group
  const response = await fetch(`http://localhost:3000/api/groups/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    notFound();
  }

  const group = await response.json();

  // Get current authenticated user
  const currentUser = await getCurrentUser();
  const CURRENT_USER_ID = currentUser?.id || null;

  // Check if current user is a member or the leader
  // Note: If user is not logged in, they can still view but can't join
  const currentUserMembership = CURRENT_USER_ID 
    ? group.members.find((m: any) => m.user.id === CURRENT_USER_ID)
    : null;
  
  const isMember = !!currentUserMembership;
  const isLeader = currentUserMembership?.role === "LEADER";

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
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <CardTitle className="text-3xl">{group.title}</CardTitle>
                <CardDescription className="flex flex-wrap items-center gap-4 text-base">
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

              {/* Action Buttons */}
              <div className="flex gap-2">
                {!currentUser ? (
                  // Not logged in - show login prompt
                  <Link href="/login">
                    <Button size="sm">Login to Join</Button>
                  </Link>
                ) : isLeader ? (
                  // User is the leader
                  <>
                    {/* Edit Button - NOW ENABLED! */}
                    <Link href={`/groups/${group.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    {/* Delete Button */}
                    <DeleteGroupButton groupId={group.id} groupTitle={group.title} />
                  </>
                ) : (
                  // User is logged in but not the leader
                  <JoinGroupButton
                    groupId={group.id}
                    isMember={isMember}
                    isLeader={isLeader}
                  />
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Status Badge */}
            {isMember && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800 font-medium">
                  {isLeader ? "🎉 You're the leader of this group" : "✅ You're a member of this group"}
                </p>
              </div>
            )}

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
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {group.description}
              </p>
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

        {/* Action Section for Non-Members */}
        {!isMember && currentUser && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">Interested in joining?</h3>
                <p className="text-gray-600">
                  Join this project to collaborate with {group.members.length} other{" "}
                  {group.members.length === 1 ? "member" : "members"}
                </p>
                <JoinGroupButton
                  groupId={group.id}
                  isMember={isMember}
                  isLeader={isLeader}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Login Prompt for Non-Logged-In Users */}
        {!currentUser && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">Want to join this project?</h3>
                <p className="text-gray-600">
                  Login to collaborate with {group.members.length}{" "}
                  {group.members.length === 1 ? "member" : "members"}
                </p>
                <Link href="/login">
                  <Button size="lg">Login to Join</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}