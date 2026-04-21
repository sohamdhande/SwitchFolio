import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="p-8 space-y-8">
      {/* Page header skeleton */}
      <div>
        <Skeleton className="h-9 w-72 mb-2" />
        <Skeleton className="h-5 w-56" />
      </div>

      {/* Stats row */}
      <div className="grid gap-6 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-200 dark:border-zinc-800 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </div>
            <Skeleton className="h-8 w-12" />
          </div>
        ))}
      </div>

      {/* Two-column section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick actions placeholder */}
        <div className="rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
          <Skeleton className="h-5 w-32 mb-6" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>

        {/* Recent projects placeholder */}
        <div className="rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
          <Skeleton className="h-5 w-36 mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-14 rounded" />
                  <Skeleton className="h-4 w-14 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Views section */}
      <div className="rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
        <Skeleton className="h-5 w-28 mb-6" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-gray-200 dark:border-zinc-800 p-4"
            >
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
