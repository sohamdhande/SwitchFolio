import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { viewId: string } }
) {
  try {
    const user = await getOrCreateUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const viewId = params.viewId;
    const body = await req.json();
    const { name, description } = body;
    let { slug } = body;

    const existingView = await db.view.findUnique({
      where: {
        id: viewId,
      },
    });

    if (!existingView || existingView.userId !== user.id) {
      return NextResponse.json({ error: "View not found or unauthorized" }, { status: 404 });
    }

    if (slug && slug !== existingView.slug) {
      // Check if new slug is already taken
      const duplicateSlug = await db.view.findFirst({
        where: {
          userId: user.id,
          slug: slug,
        },
      });

      if (duplicateSlug) {
        return NextResponse.json({ error: "A view with this slug already exists." }, { status: 409 });
      }
    } else if (!slug) {
      slug = existingView.slug;
    }

    const updatedView = await db.view.update({
      where: {
        id: viewId,
      },
      data: {
        name: name || existingView.name,
        description: description !== undefined ? description : existingView.description,
        slug,
      },
      include: {
        _count: {
          select: { projects: true },
        },
      },
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
      where: {
        id: viewId,
      },
    });

    if (!existingView || existingView.userId !== user.id) {
      return NextResponse.json({ error: "View not found or unauthorized" }, { status: 404 });
    }

    await db.view.delete({
      where: {
        id: viewId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/views/[viewId] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
