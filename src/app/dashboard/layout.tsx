import { UserButton } from "@clerk/nextjs";
import { Suspense, ReactNode } from "react";
import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { ThemeToggle } from "@/components/ThemeToggle";

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full w-full py-12">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-zinc-100">Switchfolio</h1>
        </div>
        <SidebarNav />
        <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
          <div className="flex items-center space-x-3 px-2">
            <UserButton afterSignOutUrl="/" />
            <span className="text-sm font-medium text-gray-700 dark:text-zinc-300 flex-1">Account</span>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Suspense fallback={<LoadingSpinner />}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}
