import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)", "/api/v1(.*)", "/guide(.*)"]);
const isApiRoute = createRouteMatcher(["/api(.*)"]);

// In-memory rate limit store for brute force protection
// In production with multiple instances, use Redis via @upstash/ratelimit
const authAttempts = new Map<string, { count: number; blockedUntil: number; windowStart: number }>();

const MAX_AUTH_FAILURES = 5;
const AUTH_WINDOW_MS = 10 * 60 * 1000;  // 10 minutes
const BLOCK_DURATION_MS = 30 * 60 * 1000; // 30 minutes
const MAX_BODY_SIZE = 10 * 1024; // 10KB

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

export default clerkMiddleware((auth, request) => {
  const ip = getClientIp(request);

  // 7. Request size limiting for API routes
  if (isApiRoute(request)) {
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
      return NextResponse.json(
        { error: "Payload Too Large" },
        { status: 413 }
      );
    }
  }

  // 6. Brute force protection — check if IP is blocked
  const attempt = authAttempts.get(ip);
  if (attempt) {
    const now = Date.now();

    // Currently blocked
    if (attempt.blockedUntil > now) {
      return NextResponse.json(
        { error: "Too many failed attempts. Try again later." },
        { status: 429 }
      );
    }

    // Window expired — reset
    if (now - attempt.windowStart > AUTH_WINDOW_MS) {
      authAttempts.delete(ip);
    }
  }

  if (!isPublicRoute(request)) {
    try {
      auth().protect();
    } catch {
      // Track failed auth attempt
      const now = Date.now();
      const existing = authAttempts.get(ip);

      if (existing && now - existing.windowStart <= AUTH_WINDOW_MS) {
        existing.count++;
        if (existing.count >= MAX_AUTH_FAILURES) {
          existing.blockedUntil = now + BLOCK_DURATION_MS;
        }
      } else {
        authAttempts.set(ip, { count: 1, blockedUntil: 0, windowStart: now });
      }

      throw new Error("Unauthorized");
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
