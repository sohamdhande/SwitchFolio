import { UserButton } from "@clerk/nextjs";
import { ReactNode } from "react";
import { SidebarNav } from "@/components/dashboard/SidebarNav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Switchfolio</h1>
        </div>
        <SidebarNav />
        <div className="p-4 border-t">
          <div className="flex items-center space-x-3 px-2">
            <UserButton afterSignOutUrl="/" />
            <span className="text-sm font-medium text-gray-700">Account</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
