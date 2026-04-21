"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple syntax highlighting via regex replace for spans
  // This is a naive approach as requested without external libraries
  const highlightCode = (str: string) => {
    let html = str
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Highlight keywords
    const keywords = ['import', 'from', 'export', 'default', 'function', 'const', 'if', 'return', 'await', 'async'];
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'g');
      html = html.replace(regex, `<span class="text-blue-400">${kw}</span>`);
    });

    // Highlight strings
    html = html.replace(/('[^']*'|"[^"]*"|`[^`]*`)/g, '<span class="text-green-400">$1</span>');

    return { __html: html };
  };

  return (
    <div className="relative group rounded-lg overflow-hidden my-6 border border-zinc-800 bg-zinc-950">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800 text-xs text-zinc-400">
        <span>Code</span>
        <button
          onClick={copyToClipboard}
          className="p-1.5 hover:bg-zinc-800 rounded-md transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-sm font-mono text-zinc-300">
        <pre dangerouslySetInnerHTML={highlightCode(code)} />
      </div>
    </div>
  );
}
