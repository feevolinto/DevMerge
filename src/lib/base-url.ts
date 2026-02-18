/**
 * Get the base URL for API calls
 * - Browser: Returns empty string (uses relative URLs)
 * - Server (Production): Returns NEXTAUTH_URL from env
 * - Server (Development): Returns localhost
 */
export function getBaseUrl() {
  // Browser - use relative URLs
  if (typeof window !== "undefined") {
    return "";
  }

  // Production - use NEXTAUTH_URL
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }

  // Development - use localhost
  return "http://localhost:3000";
}