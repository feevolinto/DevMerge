"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface JoinGroupButtonProps {
  groupId: string;
  isMember: boolean;
  isLeader: boolean;
}

export function JoinGroupButton({ groupId, isMember, isLeader }: JoinGroupButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoinLeave = async () => {
    setIsLoading(true);
    setError("");

    try {
      const method = isMember ? "DELETE" : "POST";
      const response = await fetch(`/api/groups/${groupId}/join`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Action failed");
      }

      // Refresh the page to show updated member list
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  // Leaders cannot leave their own group
  if (isLeader) {
    return (
      <Button size="lg" disabled>
        You're the Leader
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        size="lg"
        onClick={handleJoinLeave}
        disabled={isLoading}
        variant={isMember ? "outline" : "default"}
      >
        {isLoading
          ? "Loading..."
          : isMember
          ? "Leave Group"
          : "Join This Project"}
      </Button>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}