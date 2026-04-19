import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { db } from "@/lib/db";

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
    });

    if (!view || view.userId !== user.id) {
      return NextResponse.json({ error: "View not found" }, { status: 404 });
    }

    const body = await req.json();
    const { updates } = body as {
      updates: Array<{
        projectId: string;
        lexoRank?: string;
        isVisible?: boolean;
      }>;
    };

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json({ error: "updates array is required" }, { status: 400 });
    }

    // Process each update
    for (const update of updates) {
      const { projectId, lexoRank, isVisible } = update;

      const updateData: Record<string, unknown> = {};
      const createData: Record<string, unknown> = {
        projectId,
        viewId,
        lexoRank: lexoRank ?? "m",
        isVisible: isVisible ?? true,
      };

      if (lexoRank !== undefined) updateData.lexoRank = lexoRank;
      if (isVisible !== undefined) updateData.isVisible = isVisible;

      await db.projectsOnViews.upsert({
        where: {
          projectId_viewId: { projectId, viewId },
        },
        update: updateData,
        create: createData as {
          projectId: string;
          viewId: string;
          lexoRank: string;
          isVisible: boolean;
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/views/[viewId]/reorder error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
