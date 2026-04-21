import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata = {
  title: "Guide | Switchfolio",
  description: "User guide and API reference for Switchfolio",
};

export default function GuideLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 flex flex-col font-sans">
      <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Link 
              href="/dashboard" 
              className="flex items-center text-sm font-medium text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <span className="font-bold text-gray-900 dark:text-zinc-100 hidden sm:inline-block tracking-tight">
              Switchfolio Guide
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 md:py-12">
        {children}
      </main>
    </div>
  );
}
