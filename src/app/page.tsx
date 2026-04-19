import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Zap, LayoutGrid, Code2 } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "No Redeployment",
    description:
      "Update your portfolio in seconds. Toggle projects on or off without pushing code or waiting for a build.",
  },
  {
    icon: LayoutGrid,
    title: "Multiple Views",
    description:
      "Create tailored views for different audiences — one for frontend roles, another for fullstack, each with its own URL.",
  },
  {
    icon: Code2,
    title: "Any Stack",
    description:
      "Switchfolio is headless. Fetch your data via API and render it however you want — React, Astro, plain HTML.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Nav */}
      <header className="border-b border-gray-800/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-lg font-bold tracking-tight">Switchfolio</span>
          <div className="flex items-center gap-4 text-sm">
            <SignedOut>
              <Link
                href="/sign-in"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-950 hover:bg-gray-200 transition-colors"
              >
                Get Started
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-950 hover:bg-gray-200 transition-colors"
              >
                Dashboard
              </Link>
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 py-28 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl leading-tight">
          Your portfolio.
          <br />
          <span className="text-gray-400">One source of truth.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-gray-400 leading-relaxed">
          Control what projects recruiters see, without touching your code.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <SignedOut>
            <Link
              href="/sign-up"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-950 hover:bg-gray-200 transition-colors"
            >
              Get Started
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-950 hover:bg-gray-200 transition-colors"
            >
              Go to Dashboard
            </Link>
          </SignedIn>
          <Link
            href="https://github.com"
            target="_blank"
            className="rounded-lg border border-gray-700 px-6 py-3 text-sm font-semibold text-gray-300 hover:border-gray-500 hover:text-white transition-colors"
          >
            View on GitHub
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 pb-28">
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-gray-800 bg-gray-900/50 p-6"
            >
              <feature.icon className="h-8 w-8 text-gray-400 mb-4" />
              <h3 className="text-base font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/60 py-8 text-center text-xs text-gray-500">
        Switchfolio &middot; Built for developers who ship.
      </footer>
    </div>
  );
}
