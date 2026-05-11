import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { reorderUpdateSchema, parseBody } from "@/lib/validators";

interface UpsertUpdatePayload {
  lexoRank?: string;
  isVisible?: boolean;
}

interface UpsertCreatePayload {
  projectId: string;
  viewId: string;
  lexoRank: string;
  isVisible: boolean;
}

export async function PATCH(
  req: Request,
  { params }: { params: { viewId: string } }
) {
  try {
    const user = await getOrCreateUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const viewId = params.viewId;

    // Verify view belongs to user
    const view = await db.view.findUnique({
      where: { id: viewId },
      select: { id: true, userId: true },
    });

    if (!view || view.userId !== user.id) {
      return NextResponse.json({ error: "View not found" }, { status: 404 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = parseBody(reorderUpdateSchema, body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { updates } = parsed.data;

    // Batch all upserts into a single atomic transaction
    await db.$transaction(
      updates.map((update) => {
        const { projectId, lexoRank, isVisible } = update;

        const updateData: UpsertUpdatePayload = {};
        if (lexoRank !== undefined) updateData.lexoRank = lexoRank;
        if (isVisible !== undefined) updateData.isVisible = isVisible;

        const createData: UpsertCreatePayload = {
          projectId,
          viewId,
          lexoRank: lexoRank ?? "m",
          isVisible: isVisible ?? true,
        };

        return db.projectsOnViews.upsert({
          where: {
            projectId_viewId: { projectId, viewId },
          },
          update: updateData,
          create: createData,
        });
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/views/[viewId]/reorder error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
