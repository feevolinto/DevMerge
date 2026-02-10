import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// This is a Server Component - it runs on the server and fetches data
export default async function HomePage() {
  // Fetch groups from your API
  // In development, Next.js runs on localhost:3000
  const response = await fetch('http://localhost:3000/api/groups', {
    cache: 'no-store', // Don't cache, always get fresh data
  });
  
  const data = await response.json();
  const groups = data.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Discover Projects</h1>
        <p className="text-gray-600">
          Find collaborators and join exciting projects
        </p>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group: any) => (
          <Card key={group.id} className="flex flex-col">
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
                  <Badge key={tagItem.tag.id} variant="secondary">
                    {tagItem.tag.name}
                  </Badge>
                ))}
              </div>
            </CardContent>

            {/* Card Footer - Timeline and Button */}
            <CardFooter className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {group.timeline || 'No timeline'}
              </span>
              <Button size="sm">View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Empty State - shown when no groups */}
      {groups.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No groups found</p>
          <p className="text-gray-400">Create the first one!</p>
        </div>
      )}
    </div>
  );
}
