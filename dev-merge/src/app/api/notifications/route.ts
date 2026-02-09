import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/permissions";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ============================================
// GET /api/notifications - Get user notifications
// ============================================

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const limit = parseInt(searchParams.get("limit") || "20");

    // TODO: Get from session
    const TEMP_USER_ID = "temp-user-001";
    requireAuth(TEMP_USER_ID);

    const notifications = await prisma.notification.findMany({
      where: {
        userId: TEMP_USER_ID,
        ...(unreadOnly && { isRead: false }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    // Count unread notifications
    const unreadCount = await prisma.notification.count({
      where: {
        userId: TEMP_USER_ID,
        isRead: false,
      },
    });

    return NextResponse.json({
      data: notifications,
      unreadCount,
    });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// ============================================
// PUT /api/notifications/mark-read - Mark all as read
// ============================================

export async function PUT(req: Request) {
  try {
    // TODO: Get from session
    const TEMP_USER_ID = "temp-user-001";
    requireAuth(TEMP_USER_ID);

    await prisma.notification.updateMany({
      where: {
        userId: TEMP_USER_ID,
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
    console.error("Error marking notifications as read:", error);
    return NextResponse.json(
      { error: "Failed to mark notifications as read" },
      { status: 500 }
    );
  }
}
