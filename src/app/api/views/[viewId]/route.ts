import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateViewSchema, parseBody } from "@/lib/validators";
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

export async function PUT(
  req: Request,
  { params }: { params: { viewId: string } }
) {
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

    const parsed = parseBody(updateViewSchema, body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const viewId = params.viewId;

    const existingView = await db.view.findUnique({
      where: { id: viewId },
      select: { id: true, userId: true, slug: true, name: true, description: true },
    });

    if (!existingView || existingView.userId !== user.id) {
      return NextResponse.json({ error: "View not found or unauthorized" }, { status: 404 });
    }

    const { name, slug, description } = parsed.data;

    if (slug && slug !== existingView.slug) {
      // Check if new slug is already taken
      const duplicateSlug = await db.view.findFirst({
        where: { userId: user.id, slug },
      });

      if (duplicateSlug) {
        return NextResponse.json({ error: "A view with this slug already exists." }, { status: 409 });
      }
    }

    const updatedView = await db.view.update({
      where: { id: viewId },
      data: {
        name: name || existingView.name,
        description: description !== undefined ? description : existingView.description,
        slug: slug || existingView.slug,
      },
      select: viewSelect,
    });

    logAudit({
      userId: user.id,
      action: "view.updated",
      resource: "View",
      resourceId: viewId,
    });

    return NextResponse.json(updatedView);
  } catch (error) {
    console.error("PUT /api/views/[viewId] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { viewId: string } }
) {
  try {
    const user = await getOrCreateUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const viewId = params.viewId;

    const existingView = await db.view.findUnique({
      where: { id: viewId },
      select: { id: true, userId: true },
    });

    if (!existingView || existingView.userId !== user.id) {
      return NextResponse.json({ error: "View not found or unauthorized" }, { status: 404 });
    }

    await db.view.delete({
      where: { id: viewId },
    });

    logAudit({
      userId: user.id,
      action: "view.deleted",
      resource: "View",
      resourceId: viewId,
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/views/[viewId] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
