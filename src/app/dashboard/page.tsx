import { getOrCreateUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, LayoutGrid, Key, Plus, Eye, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardRoot() {
  const user = await getOrCreateUser();

  if (!user) {
    redirect("/sign-in");
  }

  const [projectCount, viewCount, keyCount, recentProjects, views] =
    await Promise.all([
      db.project.count({ where: { userId: user.id } }),
      db.view.count({ where: { userId: user.id } }),
      db.apiKey.count({ where: { userId: user.id } }),
      db.project.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      db.view.findMany({
        where: { userId: user.id },
        include: { _count: { select: { projects: true } } },
        orderBy: { createdAt: "desc" },
      }),
    ]);

  const stats = [
    {
      title: "Total Projects",
      value: projectCount,
      icon: FolderOpen,
      href: "/dashboard/projects",
    },
    {
      title: "Portfolio Views",
      value: viewCount,
      icon: LayoutGrid,
      href: "/dashboard/views",
    },
    {
      title: "Active API Keys",
      value: keyCount,
      icon: Key,
      href: "/dashboard/settings",
    },
  ];

  const isNewUser =
    projectCount === 0 && viewCount === 0 && keyCount === 0;

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-100">
          Welcome back, {user.username}!
        </h1>
        <p className="text-gray-500 dark:text-zinc-500 mt-2">
          Here&apos;s an overview of your portfolio.
        </p>
      </div>

      {/* Empty state for brand-new users */}
      {isNewUser && (
        <Card className="border-dashed border-2 border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50">
          <CardContent className="flex flex-col items-center justify-center py-14 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
              <FolderOpen className="h-7 w-7 text-gray-400 dark:text-zinc-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-zinc-100 mb-2">
              Welcome to Switchfolio!
            </h2>
            <p className="text-gray-500 dark:text-zinc-500 mb-6 max-w-sm">
              Start by adding your first project. You can then create views to
              tailor what different audiences see.
            </p>
            <Button asChild>
              <Link href="/dashboard/projects">
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Row */}
      <div className="grid gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:border-gray-400 dark:hover:border-zinc-600 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions + Recent Projects */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/projects">
                <FolderOpen className="h-4 w-4 mr-2" />
                Add a Project
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/views">
                <LayoutGrid className="h-4 w-4 mr-2" />
                Create a View
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/settings">
                <Settings className="h-4 w-4 mr-2" />
                Go to Settings
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {recentProjects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-3">
                  No projects yet.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/projects">
                    <Plus className="h-4 w-4 mr-1" />
                    Add your first project
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {recentProjects.map((project) => (
                  <div key={project.id} className="py-3 first:pt-0 last:pb-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">
                      {project.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {project.techStack.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Your Views */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Your Views
          </CardTitle>
        </CardHeader>
        <CardContent>
          {views.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground mb-3">
                No views created yet.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/views">
                  <Plus className="h-4 w-4 mr-1" />
                  Create your first view
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {views.map((view) => (
                <Link
                  key={view.id}
                  href={`/dashboard/views/${view.id}`}
                  className="rounded-lg border border-gray-200 dark:border-zinc-800 p-4 hover:border-gray-400 dark:hover:border-zinc-600 transition-colors"
                >
                  <p className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
                    {view.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {view._count.projects} project
                    {view._count.projects !== 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    /{view.slug}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
