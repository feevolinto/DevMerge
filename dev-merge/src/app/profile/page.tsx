import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Users, FolderKanban, Calendar } from "lucide-react";
import Link from "next/link";
import { getInitials, formatRelativeTime } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/profile/logout-button";

export default async function ProfilePage() {
  // Get current authenticated user
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    redirect("/login");
  }

  // Fetch user data
  const userResponse = await fetch(`http://localhost:3000/api/users/${currentUser.id}`, {
    cache: "no-store",
  });

  if (!userResponse.ok) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-600">Failed to load profile</p>
      </div>
    );
  }

  const user = await userResponse.json();

  // Fetch user's groups (as leader)
  const leaderGroupsResponse = await fetch(
    `http://localhost:3000/api/groups?creatorId=${currentUser.id}`,
    { cache: "no-store" }
  );
  const leaderGroupsData = await leaderGroupsResponse.json();
  const leaderGroups = leaderGroupsData.data || [];

  // Fetch all groups to find memberships
  const allGroupsResponse = await fetch("http://localhost:3000/api/groups", {
    cache: "no-store",
  });
  const allGroupsData = await allGroupsResponse.json();
  const allGroups = allGroupsData.data || [];

  // Filter groups where user is a member (but not leader)
  const memberGroups = allGroups.filter((group: any) => {
    const isMember = group.members?.some((m: any) => m.user.id === currentUser.id);
    const isLeader = group.creator.id === currentUser.id;
    return isMember && !isLeader;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.profileImage} />
              <AvatarFallback className="text-2xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
              <p className="text-gray-600 mb-3">@{user.username}</p>
              {user.bio && (
                <p className="text-gray-700 mb-4">{user.bio}</p>
              )}

              {/* Stats */}
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <FolderKanban className="h-4 w-4 text-gray-500" />
                  <span className="font-semibold">{leaderGroups.length}</span>
                  <span className="text-gray-600">Groups Created</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="font-semibold">{memberGroups.length}</span>
                  <span className="text-gray-600">Groups Joined</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">
                    Joined {formatRelativeTime(new Date(user.createdAt))}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Button Placeholder */}
            {/* Edit and Logout Buttons */}
            <div className="flex flex-col gap-2">
              <Link href="/profile/edit">
                <Button variant="outline">
                 Edit Profile
                </Button>
              </Link>
              <LogoutButton />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Groups Sections */}
      <div className="space-y-8">
        {/* Groups Created */}
        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2">Groups You Created</h2>
            <p className="text-gray-600">
              Projects you're leading ({leaderGroups.length})
            </p>
          </div>

          {leaderGroups.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <FolderKanban className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No groups created yet</h3>
                <p className="text-gray-500 mb-6">
                  Start a project and find collaborators
                </p>
                <Link href="/groups/new">
                  <Button>Create Your First Group</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {leaderGroups.map((group: any) => (
                <Card key={group.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="line-clamp-1">{group.title}</CardTitle>
                        <CardDescription>
                          {group._count.members} members • {group.timeline || 'No timeline'}
                        </CardDescription>
                      </div>
                      <Badge variant="default">Leader</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {group.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {group.tags.slice(0, 2).map((tagItem: any) => (
                          <Badge key={tagItem.tag.id} variant="secondary" className="text-xs">
                            {tagItem.tag.name}
                          </Badge>
                        ))}
                      </div>
                      <Link href={`/groups/${group.id}`}>
                        <Button size="sm" variant="outline">View</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <Separator />

        {/* Groups Joined */}
        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2">Groups You Joined</h2>
            <p className="text-gray-600">
              Projects you're collaborating on ({memberGroups.length})
            </p>
          </div>

          {memberGroups.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Not a member of any groups yet</h3>
                <p className="text-gray-500 mb-6">
                  Browse projects and join teams
                </p>
                <Link href="/">
                  <Button>Explore Groups</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {memberGroups.map((group: any) => (
                <Card key={group.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="line-clamp-1">{group.title}</CardTitle>
                        <CardDescription>
                          by {group.creator.name} • {group._count.members} members
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">Member</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {group.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {group.tags.slice(0, 2).map((tagItem: any) => (
                          <Badge key={tagItem.tag.id} variant="secondary" className="text-xs">
                            {tagItem.tag.name}
                          </Badge>
                        ))}
                      </div>
                      <Link href={`/groups/${group.id}`}>
                        <Button size="sm" variant="outline">View</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}