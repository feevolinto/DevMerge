import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createGroupSchema } from "@/lib/validators/group";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = createGroupSchema.parse(body);

    // TEMP: creatorId will be dynamic once auth exists
    const creatorId = "TEMP_USER_ID";

    const group = await prisma.group.create({
      data: {
        ...data,
        creatorId,
      },
    });

    return NextResponse.json(group, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
