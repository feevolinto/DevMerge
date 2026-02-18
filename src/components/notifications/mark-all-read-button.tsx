"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCheck } from "lucide-react";

export function MarkAllReadButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkAllAsRead = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to mark all as read");
      }

      // Refresh the page to show updated state
      router.refresh();
    } catch (error) {
      console.error("Error marking all as read:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleMarkAllAsRead}
      disabled={isLoading}
      variant="outline"
      size="sm"
    >
      <CheckCheck className="h-4 w-4 mr-2" />
      {isLoading ? "Marking all..." : "Mark all as read"}
    </Button>
  );
}