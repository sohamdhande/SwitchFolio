import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { createViewSchema, parseBody } from "@/lib/validators";
import { logAudit } from "@/lib/audit";

const viewSelect = {
  id: true,
  userId: true,
  slug: true,
  name: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { projects: true } },
} as const;

export async function GET() {
  try {
    const user = await getOrCreateUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const views = await db.view.findMany({
      where: { userId: user.id },
      select: viewSelect,
      orderBy: { createdAt: "desc" },
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

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = parseBody(createViewSchema, body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { name, description } = parsed.data;
    let { slug } = parsed.data;

    if (!slug) {
      slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    // Check for duplicate slug for this user
    const existingView = await db.view.findFirst({
      where: { userId: user.id, slug },
    });

    if (existingView) {
      return NextResponse.json({ error: "A view with this slug already exists." }, { status: 409 });
    }

    const newView = await db.view.create({
      data: {
        userId: user.id,
        name,
        description,
        slug,
      },
      select: viewSelect,
    });

    logAudit({
      userId: user.id,
      action: "view.created",
      resource: "View",
      resourceId: newView.id,
    });

    return NextResponse.json(newView, { status: 201 });
  } catch (error) {
    console.error("POST /api/views error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
