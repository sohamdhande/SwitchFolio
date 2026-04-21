"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { BookOpen } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: undefined },
  { href: "/dashboard/projects", label: "Projects", icon: undefined },
  { href: "/dashboard/views", label: "Views", icon: undefined },
  { href: "/dashboard/settings", label: "Settings", icon: undefined },
  { href: "/guide", label: "Guide", icon: BookOpen },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-4 space-y-2">
      {links.map((link) => {
        const isActive = link.href === "/dashboard" 
          ? pathname === "/dashboard"
          : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            prefetch={true}
            className={cn(
              "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100"
                : "text-gray-700 hover:bg-gray-50 dark:hover:bg-zinc-950 hover:text-gray-900 dark:hover:text-zinc-100"
            )}
          >
            {link.icon && <link.icon className="mr-2 h-4 w-4" />}
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
