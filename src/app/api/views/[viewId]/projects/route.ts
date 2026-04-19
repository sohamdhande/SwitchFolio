import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
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

    // Get all ProjectsOnViews records for this view, joined with project data
    const projectsOnViews = await db.projectsOnViews.findMany({
      where: { viewId },
      include: {
        project: true,
      },
      orderBy: {
        lexoRank: "asc",
      },
    });

    // Flatten: merge project fields with isVisible and lexoRank
    const result = projectsOnViews.map((pov) => ({
      ...pov.project,
      isVisible: pov.isVisible,
      lexoRank: pov.lexoRank,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/views/[viewId]/projects error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
