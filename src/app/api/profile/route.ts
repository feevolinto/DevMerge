import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ============================================
// GET /api/profile - Get current user profile
// ============================================

export async function GET() {
  try {
    const currentUser = await requireUser();

    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        profileImage: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// ============================================
// PUT /api/profile - Update current user profile
// ============================================

export async function PUT(req: Request) {
  try {
    const currentUser = await requireUser();
    const body = await req.json();
    const { name, username, bio, profileImage } = body;

    // Validate required fields
    if (!name || !username) {
      return NextResponse.json(
        { error: "Name and username are required" },
        { status: 400 }
      );
    }

    // Check if username is taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        username,
        NOT: { id: currentUser.id },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 409 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name,
        username,
        bio: bio || null,
        profileImage: profileImage || null,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        profileImage: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}