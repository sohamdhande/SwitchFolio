import { getOrCreateUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ProjectList } from "@/components/dashboard/ProjectList";

export default async function ProjectsPage() {
  const user = await getOrCreateUser();

  if (!user) {
    redirect("/sign-in");
  }

  const projects = await db.project.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-100">Projects</h1>
        <p className="text-gray-500 dark:text-zinc-500 mt-2">Manage the master list of projects you want to showcase.</p>
      </div>

      <ProjectList projects={projects} />
    </div>
  );
}
