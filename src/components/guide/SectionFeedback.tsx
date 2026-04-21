"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export function SectionFeedback() {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  return (
    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-zinc-800 flex items-center gap-3">
      <span className="text-xs text-gray-500 dark:text-zinc-500">
        Was this helpful?
      </span>
      <button
        onClick={() => setFeedback("up")}
        className={`p-1.5 rounded-md transition-colors ${
          feedback === "up"
            ? "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400"
            : "text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
        }`}
        aria-label="Helpful"
      >
        <ThumbsUp className="h-4 w-4" />
      </button>
      <button
        onClick={() => setFeedback("down")}
        className={`p-1.5 rounded-md transition-colors ${
          feedback === "down"
            ? "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400"
            : "text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
        }`}
        aria-label="Not helpful"
      >
        <ThumbsDown className="h-4 w-4" />
      </button>
      {feedback && (
        <span className="text-xs text-gray-500 dark:text-zinc-500">
          Thanks for the feedback!
        </span>
      )}
    </div>
  );
}
