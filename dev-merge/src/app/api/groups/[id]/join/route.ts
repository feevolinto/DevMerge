import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  canJoinGroup,
  canLeaveGroup,
  ForbiddenError,
  NotFoundError,
} from "@/lib/permissions";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ============================================
// POST /api/groups/[id]/join - Join a group
// ============================================

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // IMPORTANT: Await params in Next.js 15
    const { id: groupId } = await params;

    // TODO: Get from session
    const TEMP_USER_ID = "temp-user-001";
    requireAuth(TEMP_USER_ID);

    // Check if group exists and is active
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: {
        id: true,
        title: true,
        isActive: true,
        creatorId: true,
      },
    });

    if (!group) {
      throw new NotFoundError("Group not found");
    }

    if (!group.isActive) {
      throw new ForbiddenError("This group is no longer accepting members");
    }

    // Check if user can join
    const canJoin = await canJoinGroup(TEMP_USER_ID, groupId);
    if (!canJoin) {
      throw new ForbiddenError("You are already a member of this group");
    }

    // Create membership
    const membership = await prisma.groupMember.create({
      data: {
        groupId,
        userId: TEMP_USER_ID,
        role: Role.MEMBER,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            profileImage: true,
          },
        },
        group: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Create notification for group creator
    await prisma.notification.create({
      data: {
        userId: group.creatorId,
        type: "JOIN",
        message: `Someone joined your group "${group.title}"`,
        groupId,
        actorId: TEMP_USER_ID,
      },
    });

    return NextResponse.json(membership, { status: 201 });
  } catch (error: any) {
    console.error("Error joining group:", error);

    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "You are already a member of this group" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to join group" },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE /api/groups/[id]/join - Leave a group
// ============================================

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // IMPORTANT: Await params
    const { id: groupId } = await params;

    // TODO: Get from session
    const TEMP_USER_ID = "temp-user-001";
    requireAuth(TEMP_USER_ID);

    // Check if user can leave
    const canLeave = await canLeaveGroup(TEMP_USER_ID, groupId);
    if (!canLeave) {
      throw new ForbiddenError(
        "You cannot leave this group. Group leaders cannot leave their own group."
      );
    }

    // Delete membership
    await prisma.groupMember.delete({
      where: {
        groupId_userId: {
          groupId,
          userId: TEMP_USER_ID,
        },
      },
    });

    return NextResponse.json({
      message: "Successfully left the group",
    });
  } catch (error: any) {
    console.error("Error leaving group:", error);

    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "You are not a member of this group" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to leave group" },
      { status: 500 }
    );
  }
}