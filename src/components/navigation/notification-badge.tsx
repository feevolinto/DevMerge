import { Bell } from "lucide-react";

export async function NotificationBadge() {
  try {
    const response = await fetch("http://localhost:3000/api/notifications", {
      cache: "no-store",
    });

    if (!response.ok) {
      return (
        <div className="relative">
          <Bell className="h-5 w-5" />
        </div>
      );
    }

    const data = await response.json();
    const unreadCount = data.unreadCount || 0;

    return (
      <div className="relative">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="relative">
        <Bell className="h-5 w-5" />
      </div>
    );
  }
}