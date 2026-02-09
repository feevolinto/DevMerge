import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canViewGroupMembers, NotFoundError } from "@/lib/permissions";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ============================================
// GET /api/groups/[id]/members - Get group members
// ============================================

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: groupId } = params;

    // Check if group exists
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: { id: true, title: true },
    });

    if (!group) {
      throw new NotFoundError("Group not found");
    }

    // TODO: Get from session for permission check
    const TEMP_USER_ID = "temp-user-001";

    // Check if user can view members
    // For MVP, allow public viewing of basic member info
    // In production, you might want to restrict this
    const canView = TEMP_USER_ID
      ? await canViewGroupMembers(TEMP_USER_ID, groupId)
      : true;

    // Fetch members
    const members = await prisma.groupMember.findMany({
      where: { groupId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            profileImage: true,
            // Include bio only for authenticated users who can view
            ...(canView && { bio: true }),
          },
        },
      },
      orderBy: [{ role: "desc" }, { joinedAt: "asc" }],
    });

    return NextResponse.json({
      data: members,
      total: members.length,
    });
  } catch (error: any) {
    console.error("Error fetching group members:", error);

    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to fetch group members" },
      { status: 500 }
    );
  }
}
