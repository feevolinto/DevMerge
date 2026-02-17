import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { User } from "lucide-react";

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export async function NavAvatar() {
  const currentUser = await getCurrentUser();

  // Not logged in - show user icon that links to login
  if (!currentUser) {
    return (
      <Link
        href="/login"
        className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-[#FF6200] hover:bg-gray-300 transition-colors"
        title="Login"
      >
        <User className="h-4 w-4" />
      </Link>
    );
  }

  // Fetch user's profile image from database
  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
    select: {
      name: true,
      profileImage: true,
    },
  });

  const name = user?.name || currentUser.name || "User";
  const profileImage = user?.profileImage;
  const initials = getInitials(name);

  return (
    <Link
      href="/profile"
      title="Profile"
      className="block"
    >
      {profileImage ? (
        // Has profile picture - show it
        <img
          src={profileImage}
          alt={name}
          className="h-8 w-8 rounded-full object-cover ring-2 ring-transparent hover:ring-[#FF6200] transition-all"
        />
      ) : (
        // No profile picture - show initials
        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold hover:bg-blue-700 transition-colors ring-2 ring-transparent hover:ring-blue-300">
          {initials}
        </div>
      )}
    </Link>
  );
}