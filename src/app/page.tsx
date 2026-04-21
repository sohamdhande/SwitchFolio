import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { SdkCodeBlock } from "@/components/SdkCodeBlock";

/* ─── Feature cards ──────────────────────────────────────────── */
const features = [
  {
    emoji: "⚡",
    title: "Instant Updates",
    description:
      "Change your view, see it live in seconds. No redeployment, no waiting.",
  },
  {
    emoji: "🎯",
    title: "Multiple Views",
    description:
      "Frontend roles, ML roles, hackathons — one codebase, infinite audiences.",
  },
  {
    emoji: "🎨",
    title: "Zero Design Impact",
    description:
      "We never touch your portfolio design. You own every pixel.",
  },
];

/* ─── How-it-works steps ─────────────────────────────────────── */
const steps = [
  {
    num: "01",
    title: "Add your projects",
    description: "Build the master list of everything you've shipped.",
  },
  {
    num: "02",
    title: "Create a view",
    description: "Tailor a subset for each audience — frontend, ML, etc.",
  },
  {
    num: "03",
    title: "Toggle & reorder",
    description: "Show, hide, and rank projects per view with drag-and-drop.",
  },
  {
    num: "04",
    title: "Install the SDK",
    description: "One hook, one fetch — changes reflect instantly on your site.",
  },
];

/* ─── Testimonials ───────────────────────────────────────────── */
const testimonials = [
  {
    initials: "AK",
    name: "Arjun K.",
    role: "Full-Stack Developer",
    quote:
      "I swapped my hardcoded projects array for Switchfolio in 10 minutes. Now I reorder for every application.",
  },
  {
    initials: "RM",
    name: "Rachel M.",
    role: "Frontend Engineer",
    quote:
      "Having separate views for frontend-heavy and design roles is a game-changer. Recruiters see exactly what matters.",
  },
  {
    initials: "JP",
    name: "James P.",
    role: "CS Student",
    quote:
      "I used the agentic setup — pasted the prompt into Cursor and my portfolio was connected in under a minute.",
  },
];

/* ─── SDK snippet text ───────────────────────────────────────── */
const installCmd = "npm install @switchfolio/react";
const hookSnippet = `import { useSwitchfolio } from '@switchfolio/react'

const { data, loading, error } = useSwitchfolio({
  apiKey: process.env.NEXT_PUBLIC_SWITCHFOLIO_KEY,
  username: 'your-username',
  viewSlug: 'frontend-interviews',
})

return data.map(p => (
  <ProjectCard key={p.id} project={p} />
))`;

/* ═══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 overflow-hidden">
      {/* ───── Navbar ───── */}
      <header className="border-b border-gray-800/60 backdrop-blur-md bg-gray-950/80 sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-bold tracking-tight hover:opacity-80 transition-opacity">
            Switchfolio
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/guide"
              className="text-gray-400 hover:text-white transition-colors hidden sm:inline"
            >
              Docs
            </Link>
            <SignedOut>
              <Link
                href="/sign-in"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-950 hover:bg-gray-200 transition-colors"
              >
                Get Started
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-950 hover:bg-gray-200 transition-colors"
              >
                Dashboard
              </Link>
            </SignedIn>
          </div>
        </div>
      </header>

      {/* ───── Hero ───── */}
      <section className="mx-auto max-w-4xl px-6 pt-24 pb-20 text-center relative">
        {/* Decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-gray-700/50 bg-gray-900/50 text-xs font-medium text-gray-400 tracking-wide">
            Open Source &middot; Headless CMS for Portfolios
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl leading-[1.1]">
            Your portfolio.
            <br />
            <span className="bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 bg-clip-text text-transparent">
              One source of truth.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 leading-relaxed sm:text-xl">
            Control what recruiters see without touching your code.
            <br className="hidden sm:block" />
            Switch views instantly. No redeployment. Ever.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <SignedOut>
              <Link
                href="/sign-up"
                className="rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-gray-950 hover:bg-gray-200 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/10"
              >
                Get Started Free
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-gray-950 hover:bg-gray-200 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/10"
              >
                Go to Dashboard
              </Link>
            </SignedIn>
            <Link
              href="/guide"
              className="rounded-xl border border-gray-700 px-7 py-3.5 text-sm font-semibold text-gray-300 hover:border-gray-500 hover:text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              View Demo
            </Link>
          </div>
        </div>

        {/* ── Flow Diagram (HTML/CSS) ── */}
        <div className="mt-20 flex items-center justify-center gap-0 flex-wrap">
          {/* Dashboard box */}
          <div className="relative rounded-xl border border-gray-700/60 bg-gray-900/70 backdrop-blur px-6 py-4 text-center w-44 shadow-xl shadow-black/30">
            <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">
              Dashboard
            </div>
            <div className="text-sm font-semibold text-gray-200">
              Manage views
            </div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
          </div>

          {/* Arrow 1 */}
          <div className="flex items-center gap-0 px-2">
            <div className="w-10 h-px bg-gradient-to-r from-gray-700 to-gray-500" />
            <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-gray-500" />
          </div>

          {/* API box */}
          <div className="relative rounded-xl border border-indigo-500/30 bg-indigo-500/10 backdrop-blur px-6 py-4 text-center w-44 shadow-xl shadow-indigo-500/5">
            <div className="text-xs uppercase tracking-widest text-indigo-400/70 mb-1">
              API
            </div>
            <div className="text-sm font-semibold text-indigo-200">
              /v1/projects
            </div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            </div>
          </div>

          {/* Arrow 2 */}
          <div className="flex items-center gap-0 px-2">
            <div className="w-10 h-px bg-gradient-to-r from-gray-700 to-gray-500" />
            <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-gray-500" />
          </div>

          {/* Portfolio box */}
          <div className="relative rounded-xl border border-gray-700/60 bg-gray-900/70 backdrop-blur px-6 py-4 text-center w-44 shadow-xl shadow-black/30">
            <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">
              Your Site
            </div>
            <div className="text-sm font-semibold text-gray-200">
              Portfolio
            </div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            </div>
          </div>
        </div>
      </section>

      {/* ───── Features ───── */}
      <section className="mx-auto max-w-5xl px-6 pb-28">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need. Nothing you don&apos;t.
          </h2>
          <p className="mt-3 text-gray-400 max-w-xl mx-auto">
            Switchfolio stays out of your way and lets you ship faster.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-gray-800/60 bg-gray-900/40 p-7 transition-all hover:border-gray-700 hover:bg-gray-900/70 hover:shadow-xl hover:shadow-black/20"
            >
              <div className="text-3xl mb-4">{f.emoji}</div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed text-gray-400">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── How It Works ───── */}
      <section className="border-t border-gray-800/40 bg-gray-900/30 py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Up and running in four steps
            </h2>
            <p className="mt-3 text-gray-400">
              From zero to a live, headless portfolio in minutes.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.num} className="relative">
                <div className="text-4xl font-black text-gray-800/50 mb-3 font-mono">
                  {s.num}
                </div>
                <h3 className="text-base font-semibold mb-1">{s.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── SDK Snippet ───── */}
      <section className="py-28">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Drop-in SDK
            </h2>
            <p className="mt-3 text-gray-400">
              Install, hook, done. Works with React, Next.js, or fetch it raw.
            </p>
          </div>

          <SdkCodeBlock label="Install" code={installCmd} />
          <SdkCodeBlock label="Usage" code={hookSnippet} />
        </div>
      </section>

      {/* ───── Social Proof ───── */}
      <section className="border-t border-gray-800/40 bg-gray-900/30 py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Built for developers who care about their craft
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-gray-800/60 bg-gray-900/40 p-6"
              >
                <p className="text-sm leading-relaxed text-gray-300 mb-5 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="border-t border-gray-800/60 py-12">
        <div className="mx-auto max-w-5xl px-6 flex flex-col items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <Link href="/guide" className="hover:text-white transition-colors">
              Guide
            </Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link
              href="https://github.com/sohamdhande/SwitchFolio"
              target="_blank"
              className="hover:text-white transition-colors"
            >
              GitHub
            </Link>
            <Link
              href="https://www.npmjs.com/package/@switchfolio/react"
              target="_blank"
              className="hover:text-white transition-colors"
            >
              @switchfolio/react on npm
            </Link>
          </div>
          <div className="text-xs text-gray-600">
            Built by Soham Dhande &middot; Switchfolio
          </div>
        </div>
      </footer>
    </div>
  );
}
