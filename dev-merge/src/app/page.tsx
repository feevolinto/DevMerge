import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; tag?: string }>;
}) {
  // CHANGED: Await searchParams
  const params = await searchParams;
  
  // Build API URL with search parameters
  const urlParams = new URLSearchParams();
  if (params.search) urlParams.append("search", params.search);
  if (params.tag) urlParams.append("tag", params.tag);
  
  const url = `http://localhost:3000/api/groups${urlParams.toString() ? `?${urlParams}` : ""}`;

  // Fetch groups from your API
  const response = await fetch(url, {
    cache: 'no-store',
  });
  
  const data = await response.json();
  const groups = data.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Discover Projects</h1>
          <p className="text-gray-600">
            Find collaborators and join exciting projects
          </p>
        </div>
        <Link href="/groups/new">
          <Button size="lg">Create Group</Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <form action="/" method="GET">
          <div className="flex gap-4 max-w-2xl">
            <Input
              name="search"
              placeholder="Search projects..."
              defaultValue={params.search}
              className="flex-1"
            />
            <Button type="submit">Search</Button>
            {(params.search || params.tag) && (
              <Link href="/">
                <Button type="button" variant="outline">Clear</Button>
              </Link>
            )}
          </div>
        </form>
      </div>

      {/* Active Filters */}
      {(params.search || params.tag) && (
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {params.search && (
            <Badge variant="secondary">
              Search: {params.search}
            </Badge>
          )}
          {params.tag && (
            <Badge variant="secondary">
              Tag: {params.tag}
            </Badge>
          )}
        </div>
      )}

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group: any) => (
          <Card key={group.id} className="flex flex-col hover:shadow-lg transition-shadow">
            {/* Card Header - Title and Creator */}
            <CardHeader>
              <CardTitle className="line-clamp-2">{group.title}</CardTitle>
              <CardDescription>
                by {group.creator.name} • {group._count.members} members
              </CardDescription>
            </CardHeader>

            {/* Card Content - Description and Tags */}
            <CardContent className="flex-1">
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                {group.description}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {group.tags.slice(0, 3).map((tagItem: any) => (
                  <Link
                    key={tagItem.tag.id}
                    href={`/?tag=${tagItem.tag.name}`}
                  >
                    <Badge variant="secondary" className="cursor-pointer hover:bg-gray-300">
                      {tagItem.tag.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>

            {/* Card Footer - Timeline and Button */}
            <CardFooter className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {group.timeline || 'No timeline'}
              </span>
              <Link href={`/groups/${group.id}`}>
                <Button size="sm">View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Empty State - shown when no groups */}
      {groups.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-2">No groups found</p>
          <p className="text-gray-400 mb-4">
            {params.search || params.tag 
              ? "Try a different search term" 
              : "Create the first one!"}
          </p>
          <Link href="/groups/new">
            <Button>Create Group</Button>
          </Link>
        </div>
      )}
    </div>
  );
}