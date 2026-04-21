import { getOrCreateUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ViewProjectManager } from "@/components/dashboard/ViewProjectManager";
import { ViewProject } from "@/types";

export default async function ViewDetailPage({
  params,
}: {
  params: { viewId: string };
}) {
  const user = await getOrCreateUser();

  if (!user) {
    redirect("/sign-in");
  }

  const view = await db.view.findUnique({
    where: { id: params.viewId },
  });

  if (!view || view.userId !== user.id) {
    redirect("/dashboard/views");
  }

  // Fetch projects and view relationships in parallel
  const [allProjects, projectsOnViews] = await Promise.all([
    db.project.findMany({
      where: { userId: user.id },
      orderBy: { title: "asc" },
    }),
    db.projectsOnViews.findMany({
      where: { viewId: view.id },
    }),
  ]);

  // Build a map for quick lookup
  const povMap = new Map(
    projectsOnViews.map((pov) => [
      pov.projectId,
      { isVisible: pov.isVisible, lexoRank: pov.lexoRank },
    ])
  );

  // Merge: attach isVisible and lexoRank to each project
  const mergedProjects: ViewProject[] = allProjects.map((project) => {
    const pov = povMap.get(project.id);
    return {
      ...project,
      isVisible: pov?.isVisible ?? false,
      lexoRank: pov?.lexoRank ?? "m",
    };
  });

  // Sort: visible first by lexoRank, then hidden alphabetically
  const visible = mergedProjects
    .filter((p) => p.isVisible)
    .sort((a, b) => a.lexoRank.localeCompare(b.lexoRank));
  const hidden = mergedProjects
    .filter((p) => !p.isVisible)
    .sort((a, b) => a.title.localeCompare(b.title));

  const sortedProjects = [...visible, ...hidden];

  return (
    <ViewProjectManager
      viewId={view.id}
      viewName={view.name}
      initialProjects={sortedProjects}
    />
  );
}
