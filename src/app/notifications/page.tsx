import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils";
import { MarkAsReadButton } from "@/components/notifications/mark-as-read-button";
import { MarkAllReadButton } from "@/components/notifications/mark-all-read-button";
import { getCurrentUser } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function NotificationsPage() {
  // Redirect if not logged in
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/login");
  }

  // Fetch directly from database
  const notifications = await prisma.notification.findMany({
    where: {
      userId: currentUser.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Bell className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold">Notifications</h1>
          </div>
          {unreadCount > 0 && (
            <MarkAllReadButton />
          )}
        </div>
        <p className="text-gray-600">
          {unreadCount > 0 ? (
            <>
              You have{" "}
              <span className="font-semibold text-blue-600">{unreadCount}</span>{" "}
              unread notification{unreadCount !== 1 ? "s" : ""}
            </>
          ) : (
            "You're all caught up! 🎉"
          )}
        </p>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <Bell className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No notifications yet</h3>
              <p className="text-gray-500 mb-6">
                When people join your groups, you'll see notifications here
              </p>
              <Link href="/">
                <Button>Browse Groups</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`${
                notification.isRead
                  ? "bg-white"
                  : "bg-blue-50 border-blue-200"
              } transition-all hover:shadow-md`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-base">
                        {notification.message}
                      </CardTitle>
                      {!notification.isRead && (
                        <Badge variant="default" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-sm">
                      {formatRelativeTime(new Date(notification.createdAt))}
                    </CardDescription>
                  </div>

                  {/* Mark as Read Button */}
                  {!notification.isRead && (
                    <MarkAsReadButton notificationId={notification.id} />
                  )}
                </div>
              </CardHeader>

              {/* Link to Group if available */}
              {notification.groupId && (
                <CardContent className="pt-0">
                  <Link href={`/groups/${notification.groupId}`}>
                    <Button variant="outline" size="sm">
                      View Group
                    </Button>
                  </Link>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Back to Home */}
      {notifications.length > 0 && (
        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="ghost">Back to Groups</Button>
          </Link>
        </div>
      )}
    </div>
  );
}