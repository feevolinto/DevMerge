import type { Metadata } from "next";
import "./globals.css";
import { NotificationBadge } from "@/components/navigation/notification-badge";
import { NavAvatar } from "@/components/navigation/nav-avatar";
import Link from "next/link";
import { Home } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Dev Merge",
  icons: "/logo0.svg",
  description: "A collaboration platform for developers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <nav className="bg-white border-b sticky top-0 z-40">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <Image 
                  src="/logo.svg"           
                  alt="Dev Merge"
                  width={100}                 
                  height={100}
                  className=""
                />
              </Link>

              {/* Right Side Icons */}
              <div className="flex items-center gap-10">

                {/* Home Icon */}
                <Link
                  href="/"
                  className="text-[#FF6200] hover:text-[#090086] transition-colors"
                  title="Explore"
                >
                  <Home className="h-5 w-5" />
                </Link>

                {/* Bell Icon with Badge */}
                <Link
                  href="/notifications"
                  className="text-[#FF6200] hover:text-[#090086] transition-colors "
                  title="Notifications"
                >
                  <NotificationBadge />
                </Link>

                {/* Profile Avatar */}
                <NavAvatar />

              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="min-h-[calc(100vh-8rem)]">{children}</main>

        {/* Footer */}
        <footer className="mt-auto py-6 bg-white border-t">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            © 2026 Dev Merge | Feevol. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}