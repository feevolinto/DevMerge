import type { Metadata } from "next";
import "./globals.css";

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
      <body className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <nav className="bg-white border-b sticky top-0 z-10">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-blue-600">Dev Merge</h1>
              </div>

              {/* Navigation Links */}
              <div className="flex items-center gap-4">
                <a href="/" className="text-gray-700 hover:text-blue-600">
                  Explore
                </a>
                <a href="/notifications" className="text-gray-700 hover:text-blue-600">
                  Notifications
                </a>
                <a href="/profile" className="text-gray-700 hover:text-blue-600">
                  Profile
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="mt-auto py-6 bg-white border-t">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            © 2026 Dev Merge. Built with Next.js and Prisma.
          </div>
        </footer>
      </body>
    </html>
  );
}
