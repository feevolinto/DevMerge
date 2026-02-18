"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useState } from "react";

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      variant="outline"
      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
    >
      <LogOut className="h-4 w-4 mr-2" />
      {isLoading ? "Logging out..." : "Log out"}
    </Button>
  );
}