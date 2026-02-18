import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  canJoinGroup,
  canLeaveGroup,
  ForbiddenError,
  NotFoundError,
} from "@/lib/permissions";
import { Role } from "@prisma/client";
import { requireUser } from "@/lib/auth-helpers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/groups/[id]/join
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: groupId } = await params;
    
    // Get authenticated user
    const currentUser = await requireUser();

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

    const canJoin = await canJoinGroup(currentUser.id, groupId);
    if (!canJoin) {
      throw new ForbiddenError("You are already a member of this group");
    }

    const membership = await prisma.groupMember.create({
      data: {
        groupId,
        userId: currentUser.id,
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
        message: `${currentUser.name} joined your group "${group.title}"`,
        groupId,
        actorId: currentUser.id,
      },
    });

    return NextResponse.json(membership, { status: 201 });
  } catch (error: any) {
    console.error("Error joining group:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "You must be logged in to join a group" },
        { status: 401 }
      );
    }

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

// DELETE /api/groups/[id]/join
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: groupId } = await params;
    
    // Get authenticated user
    const currentUser = await requireUser();

    const canLeave = await canLeaveGroup(currentUser.id, groupId);
    if (!canLeave) {
      throw new ForbiddenError(
        "You cannot leave this group. Group leaders cannot leave their own group."
      );
    }

    await prisma.groupMember.delete({
      where: {
        groupId_userId: {
          groupId,
          userId: currentUser.id,
        },
      },
    });

    return NextResponse.json({
      message: "Successfully left the group",
    });
  } catch (error: any) {
    console.error("Error leaving group:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

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