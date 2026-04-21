"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export interface Section {
  id: string;
  title: string;
}

export function TableOfContents({ sections }: { sections: Section[] }) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || "");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-10% 0px -80% 0px" }
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  return (
    <>
      {/* Mobile Floating Button */}
      <button
        onClick={toggleMobile}
        className="md:hidden fixed bottom-6 right-6 z-50 p-4 bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full shadow-lg"
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-white dark:bg-zinc-950 transform transition-transform md:relative md:inset-auto md:translate-x-0 w-64 md:block flex-shrink-0 border-r border-gray-200 dark:border-zinc-800 p-6 md:p-0 pt-20 md:pt-0 md:bg-transparent overflow-y-auto",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="md:sticky md:top-24 space-y-1">
          <h4 className="font-semibold text-sm mb-4 text-gray-900 dark:text-zinc-100 uppercase tracking-wider">
            Contents
          </h4>
          <ul className="space-y-2">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm transition-colors",
                    activeId === section.id
                      ? "bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 font-medium"
                      : "text-gray-600 dark:text-zinc-400 hover:text-gray-900 hover:bg-gray-50 dark:hover:text-zinc-100 dark:hover:bg-zinc-800"
                  )}
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
