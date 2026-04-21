import { getOrCreateUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ViewList } from "@/components/dashboard/ViewList";

export default async function ViewsPage() {
  const user = await getOrCreateUser();

  if (!user) {
    redirect("/sign-in");
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

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-100">Manage Views</h1>
        <p className="text-gray-500 dark:text-zinc-500 mt-2">Organize your projects into custom portfolio views.</p>
      </div>

      <ViewList views={views} />
    </div>
  );
}
