"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface MarkAsReadButtonProps {
  notificationId: string;
}

export function MarkAsReadButton({ notificationId }: MarkAsReadButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkAsRead = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to mark as read");
      }

      // Refresh the page to show updated state
      router.refresh();
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={handleMarkAsRead}
      disabled={isLoading}
      className="shrink-0"
    >
      <Check className="h-4 w-4 mr-1" />
      {isLoading ? "Marking..." : "Mark as read"}
    </Button>
  );
}