import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createGroupSchema, groupQuerySchema } from "@/lib/validators/group";
import { requireAuth } from "@/lib/permissions";
import { slugify } from "@/lib/utils";
import { Role } from "@prisma/client";
import { ZodError } from "zod";

// Force dynamic rendering for Prisma 7
export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // Explicitly use Node.js runtime

// ============================================
// GET /api/groups - Fetch groups with filters
// ============================================

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Parse and validate query parameters
    const params = groupQuerySchema.parse({
      search: searchParams.get("search"),
      tag: searchParams.get("tag"),
      creatorId: searchParams.get("creatorId"),
      limit: searchParams.get("limit"),
      cursor: searchParams.get("cursor"),
    });

    // Build where clause
    const where: any = {
      isActive: true,
    };

    // Add search filter
    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: "insensitive" } },
        { description: { contains: params.search, mode: "insensitive" } },
      ];
    }

    // Add tag filter
    if (params.tag) {
      where.tags = {
        some: {
          tag: {
            OR: [
              { name: { equals: params.tag, mode: "insensitive" } },
              { slug: { equals: slugify(params.tag) } },
            ],
          },
        },
      };
    }

    // Add creator filter
    if (params.creatorId) {
      where.creatorId = params.creatorId;
    }

    // Fetch groups with cursor-based pagination
    const groups = await prisma.group.findMany({
      where,
      take: params.limit + 1, // Fetch one extra to determine if there are more
      ...(params.cursor && {
        skip: 1,
        cursor: { id: params.cursor },
      }),
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
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Determine if there are more results
    const hasMore = groups.length > params.limit;
    const data = hasMore ? groups.slice(0, -1) : groups;
    const nextCursor = hasMore ? data[data.length - 1].id : undefined;

    return NextResponse.json({
      data,
      pagination: {
        cursor: nextCursor,
        hasMore,
      },
    });
  } catch (error: any) {
    console.error("Error fetching groups:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/groups - Create a new group
// ============================================

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate input
    const data = createGroupSchema.parse(body);

    // TODO: Get userId from session once auth is implemented
    // For now, use a temporary user
    const TEMP_USER_ID = "temp-user-001";

    // Ensure temp user exists (development only)
    const user = await prisma.user.upsert({
      where: { id: TEMP_USER_ID },
      update: {},
      create: {
        id: TEMP_USER_ID,
        name: "Dev User",
        username: "devuser",
        email: "dev@devmerge.com",
        bio: "Temporary development user",
      },
    });

    // Verify authentication
    requireAuth(user.id);

    // Create group with creator as leader
    const group = await prisma.group.create({
      data: {
        title: data.title,
        description: data.description,
        timeline: data.timeline,
        creatorId: user.id,
        
        // Auto-add creator as LEADER
        members: {
          create: {
            userId: user.id,
            role: Role.LEADER,
          },
        },

        // Handle tags if provided
        ...(data.tags && data.tags.length > 0 && {
          tags: {
            create: data.tags.map((tagName) => ({
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
          },
        }),
      },
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

    return NextResponse.json(group, { status: 201 });
  } catch (error: any) {
    console.error("Error creating group:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A group with this title already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to create group" },
      { status: 500 }
    );
  }
}
