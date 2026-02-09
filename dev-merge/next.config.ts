import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Strict mode for better debugging
  reactStrictMode: true,

  // Experimental features
  experimental: {
    // Enable server actions if needed
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Environment variables validation
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  // TypeScript strict mode
  typescript: {
    // Fail build on type errors
    ignoreBuildErrors: false,
  },
};

export default nextConfig;

