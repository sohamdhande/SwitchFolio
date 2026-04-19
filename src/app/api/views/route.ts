import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const user = await getOrCreateUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const views = await db.view.findMany({
      where: {
        userId: user.id,
      },
      include: {
        _count: {
          select: { projects: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(views);
  } catch (error) {
    console.error("GET /api/views error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description } = body;
    let { slug } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!slug) {
      slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    // Check for duplicate slug for this user
    const existingView = await db.view.findFirst({
      where: {
        userId: user.id,
        slug: slug,
      },
    });

    if (existingView) {
      return NextResponse.json({ error: "A view with this slug already exists." }, { status: 409 });
    }

    const newView = await db.view.create({
      data: {
        userId: user.id,
        name,
        description: description || null,
        slug,
      },
      include: {
        _count: {
          select: { projects: true },
        },
      },
    });

    return NextResponse.json(newView, { status: 201 });
  } catch (error) {
    console.error("POST /api/views error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
