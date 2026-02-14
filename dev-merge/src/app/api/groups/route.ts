import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createGroupSchema, groupQuerySchema } from "@/lib/validators/group";
import { slugify } from "@/lib/utils";
import { Role } from "@prisma/client";
import { ZodError } from "zod";
import { requireUser } from "@/lib/auth-helpers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET /api/groups
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    const params = groupQuerySchema.parse({
      search: searchParams.get("search"),
      tag: searchParams.get("tag"),
      creatorId: searchParams.get("creatorId"),
      limit: searchParams.get("limit"),
      cursor: searchParams.get("cursor"),
    });

    const where: any = {
      isActive: true,
    };

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: "insensitive" } },
        { description: { contains: params.search, mode: "insensitive" } },
      ];
    }

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

    if (params.creatorId) {
      where.creatorId = params.creatorId;
    }

    const groups = await prisma.group.findMany({
      where,
      take: params.limit + 1,
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
        members: {
          select: {
            id: true,
            role: true,
            user: {
              select: {
                id: true,
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
        { error: "Invalid query parameters", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}

// POST /api/groups
export async function POST(req: Request) {
  try {
    // Get authenticated user
    const currentUser = await requireUser();
    
    const body = await req.json();
    const data = createGroupSchema.parse(body);

    const group = await prisma.group.create({
      data: {
        title: data.title,
        description: data.description,
        timeline: data.timeline,
        creatorId: currentUser.id,
        
        members: {
          create: {
            userId: currentUser.id,
            role: Role.LEADER,
          },
        },

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

    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "You must be logged in to create a group" },
        { status: 401 }
      );
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
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