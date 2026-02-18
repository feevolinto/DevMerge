import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ============================================
// GET /api/notifications - Get user notifications
// ============================================

export async function GET() {
  try {
    const currentUser = await requireUser();

    const notifications = await prisma.notification.findMany({
      where: {
        userId: currentUser.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return NextResponse.json({
      data: notifications,
      unreadCount,
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { data: [], unreadCount: 0 },
        { status: 200 }
      );
    }

    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// ============================================
// PUT /api/notifications - Mark ALL as read
// ============================================

export async function PUT() {
  try {
    const currentUser = await requireUser();

    await prisma.notification.updateMany({
      where: {
        userId: currentUser.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({
      message: "All notifications marked as read",
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    console.error("Error marking notifications as read:", error);
    return NextResponse.json(
      { error: "Failed to mark notifications as read" },
      { status: 500 }
    );
  }
}