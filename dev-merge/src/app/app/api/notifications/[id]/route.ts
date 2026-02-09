import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, ForbiddenError, NotFoundError } from "@/lib/permissions";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ============================================
// PUT /api/notifications/[id] - Mark notification as read
// ============================================

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // TODO: Get from session
    const TEMP_USER_ID = "temp-user-001";
    requireAuth(TEMP_USER_ID);

    // Check if notification exists and belongs to user
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundError("Notification not found");
    }

    if (notification.userId !== TEMP_USER_ID) {
      throw new ForbiddenError("You can only mark your own notifications as read");
    }

    // Update notification
    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Error updating notification:", error);

    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE /api/notifications/[id] - Delete notification
// ============================================

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // TODO: Get from session
    const TEMP_USER_ID = "temp-user-001";
    requireAuth(TEMP_USER_ID);

    // Check if notification exists and belongs to user
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundError("Notification not found");
    }

    if (notification.userId !== TEMP_USER_ID) {
      throw new ForbiddenError("You can only delete your own notifications");
    }

    // Delete notification
    await prisma.notification.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Notification deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting notification:", error);

    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}
