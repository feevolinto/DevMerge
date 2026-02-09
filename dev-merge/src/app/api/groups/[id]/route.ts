import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateGroupSchema } from "@/lib/validators/group";
import {
  requireAuth,
  canEditGroup,
  canDeleteGroup,
  ForbiddenError,
  NotFoundError,
} from "@/lib/permissions";
import { slugify } from "@/lib/utils";
import { ZodError } from "zod";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ============================================
// GET /api/groups/[id] - Get single group
// ============================================

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            profileImage: true,
            bio: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                profileImage: true,
              },
            },
          },
          orderBy: [{ role: "desc" }, { joinedAt: "asc" }],
        },
      },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    return NextResponse.json(group);
  } catch (error: any) {
    console.error("Error fetching group:", error);
    return NextResponse.json(
      { error: "Failed to fetch group" },
      { status: 500 }
    );
  }
}

// ============================================
// PUT /api/groups/[id] - Update group
// ============================================

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    // Validate input
    const data = updateGroupSchema.parse(body);

    // TODO: Get from session
    const TEMP_USER_ID = "temp-user-001";
    requireAuth(TEMP_USER_ID);

    // Check if group exists
    const existingGroup = await prisma.group.findUnique({
      where: { id },
    });

    if (!existingGroup) {
      throw new NotFoundError("Group not found");
    }

    // Check permissions
    const canEdit = await canEditGroup(TEMP_USER_ID, id);
    if (!canEdit) {
      throw new ForbiddenError("Only group leaders can edit the group");
    }

    // Separate tags from other data
    const { tags, ...updateData } = data;

    // Build update object
    const updatePayload: any = {
      ...updateData,
    };

    // Handle tags if provided
    if (tags) {
      updatePayload.tags = {
        // Delete existing tags
        deleteMany: {},
        // Create new tags
        create: tags.map((tagName) => ({
          tag: {
            connectOrCreate: {
              where: { name: tagName },
              create: {
                name: tagName,
                slug: slugify(tagName),
              },
            },
          },
        })),
      };
    }

    // Update group
    const updatedGroup = await prisma.group.update({
      where: { id },
      data: updatePayload,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            profileImage: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                profileImage: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(updatedGroup);
  } catch (error: any) {
    console.error("Error updating group:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: error.message || "Failed to update group" },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE /api/groups/[id] - Delete group
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

    // Check if group exists
    const existingGroup = await prisma.group.findUnique({
      where: { id },
      include: {
        members: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!existingGroup) {
      throw new NotFoundError("Group not found");
    }

    // Check permissions
    const canDelete = await canDeleteGroup(TEMP_USER_ID, id);
    if (!canDelete) {
      throw new ForbiddenError("Only group leaders can delete the group");
    }

    // Create notifications for all members (except creator)
    const memberIds = existingGroup.members
      .map((m) => m.userId)
      .filter((userId) => userId !== TEMP_USER_ID);

    if (memberIds.length > 0) {
      await prisma.notification.createMany({
        data: memberIds.map((userId) => ({
          userId,
          type: "GROUP_DELETED",
          message: `The group "${existingGroup.title}" has been deleted`,
          groupId: id,
          actorId: TEMP_USER_ID,
        })),
      });
    }

    // Delete the group (cascade will handle members and tags)
    await prisma.group.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Group deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting group:", error);

    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: error.message || "Failed to delete group" },
      { status: 500 }
    );
  }
}