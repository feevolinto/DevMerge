import type { Metadata } from "next";
import "./globals.css";
import { NotificationBadge } from "@/components/navigation/notification-badge";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Dev Merge - Find Your Team",
  description: "A collaboration platform for developers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#101010]">
        {/* Navigation Bar */}
        <nav className="bg-[#101010] sticky top-0 z-40">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <h1 className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                   <Image 
                  src="/logo.svg"           
                  alt="Dev Merge"
                  width={100}                 
                  height={100}
                  className=""
                />
                </h1>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-6">
                <Link 
                  href="/" 
                  className="text-white hover:text-gray-200 font-medium transition-colors"
                >
                  Explore
                </Link>
                <Link 
                  href="/notifications" 
                  className="text-white hover:text-gray-200 font-medium transition-colors flex items-center gap-2"
                >
                  <NotificationBadge />
                  <span>Notifications</span>
                </Link>
                <Link 
                  href="/profile" 
                  className="text-white hover:text-gray-200 font-medium transition-colors"
                >
                  Profile
                </Link>
              </div>

              {/* Mobile Navigation */}
              <div className="flex md:hidden items-center gap-4">
                <Link 
                  href="/notifications"
                  className="text-white hover:text-gray-200"
                >
                  <NotificationBadge />
                </Link>
                <Link 
                  href="/profile" 
                  className="text-white hover:text-gray-200 font-medium"
                >
                  Profile
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="min-h-[calc(100vh-8rem)]">{children}</main>

        {/* Footer */}
        <footer className="mt-auto py-6 bg-[#101010]">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            © 2026 Dev Merge. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}