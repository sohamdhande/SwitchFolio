import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { rebalanceRanks } from "@/lib/lexorank";

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

    // Fetch all visible projects in their current order
    const currentItems = await db.projectsOnViews.findMany({
      where: { viewId, isVisible: true },
      orderBy: { lexoRank: "asc" },
      select: { projectId: true },
    });

    // Rebalance: assign evenly distributed ranks
    const rebalanced = rebalanceRanks(
      currentItems.map((item) => ({ id: item.projectId }))
    );

    // Write all new ranks in a single atomic transaction
    await db.$transaction(
      rebalanced.map((item) =>
        db.projectsOnViews.update({
          where: {
            projectId_viewId: { projectId: item.id, viewId },
          },
          data: { lexoRank: item.lexoRank },
        })
      )
    );

    return NextResponse.json({ success: true, rebalanced: rebalanced.length });
  } catch (error) {
    console.error("PATCH /api/views/[viewId]/rebalance error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
