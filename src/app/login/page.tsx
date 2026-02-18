"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError("Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex ">

      {/* ── LEFT SIDE: Logo + Tagline ── */}
      <div className="hidden lg:flex w-1/2 bg-white flex-col items-center justify-center px-12">
        {/* Logo */}
        <div className="mb-6">
          <Image
            src="/logo.svg"
            alt="Dev Merge Logo"
            width={250}
            height={250}
            priority
          />
        </div>

        {/* Tagline */}
        <p className="text-[#FF6200] text-xl text-center max-w-sm leading-relaxed">
          Find your team. Build something great.
        </p>

        {/* Decorative dots */}
        <div className="flex gap-2 mt-12">
          <div className="h-2 w-2 rounded-full bg-[#FF6200]/30" />
          <div className="h-2 w-8 rounded-full bg-[#FF6200]" />
          <div className="h-2 w-2 rounded-full bg-[#FF6200]/30" />
        </div>
      </div>

      {/* ── RIGHT SIDE: Login Form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">

          {/* Mobile Logo (only shows on small screens) */}
          <div className="flex justify-center mb-8 lg:hidden">
            <Image
              src="/logo.svg"
              alt="Dev Merge Logo"
              width={80}
              height={80}
              priority
            />
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-bold">
                Welcome back!
              </CardTitle>
              <CardDescription>
                Sign in to your Dev Merge account
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

    </div>
  );
}