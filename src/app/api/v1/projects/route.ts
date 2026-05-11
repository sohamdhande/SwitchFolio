import { NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-key";
import { db } from "@/lib/db";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Only initialize rate limiting if Upstash env vars are configured
// (allows local dev to work without Redis)
const ratelimit = process.env.UPSTASH_REDIS_REST_URL
  ? new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(30, "60 s"),
  })
  : null;

function corsHeaders(origin?: string): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin ?? "",
    "Access-Control-Allow-Methods": "GET",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
  };
}

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("Origin") ?? "*";
  return new NextResponse(null, { status: 200, headers: corsHeaders(origin) });
}

export async function GET(req: Request) {
  const requestOrigin = req.headers.get("Origin") ?? "";

  try {
    // 1. Extract and validate API key
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401, headers: corsHeaders(requestOrigin) }
      );
    }

    const rawKey = authHeader.replace("Bearer ", "");
    const keyResult = await validateApiKey(rawKey);

    if (!keyResult) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401, headers: corsHeaders(requestOrigin) }
      );
    }

    // 3. Enforce API key permissions
    if (!keyResult.permissions.includes("read:projects")) {
      return NextResponse.json(
        { error: "Insufficient permissions: read:projects required" },
        { status: 403, headers: corsHeaders(requestOrigin) }
      );
    }

    // 2. Rate limit by API key prefix (more accurate than IP per client)
    const keyPrefix = rawKey.split("_").slice(0, 3).join("_"); // sk_live_XXXX
    if (ratelimit) {
      const { success } = await ratelimit.limit(keyPrefix);
      if (!success) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Try again shortly." },
          { status: 429, headers: corsHeaders(requestOrigin) }
        );
      }
    }

    // 3. Parse query params
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("user");
    const viewSlug = searchParams.get("view");

    if (!username || !viewSlug) {
      return NextResponse.json(
        { error: "Missing required query params: user, view" },
        { status: 400, headers: corsHeaders(requestOrigin) }
      );
    }

    // 4. Look up user by username
    const user = await db.user.findUnique({
      where: { username },
      select: { id: true, allowedOrigins: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, headers: corsHeaders(requestOrigin) }
      );
    }

    // 5. Verify API key belongs to this user
    if (keyResult.userId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403, headers: corsHeaders(requestOrigin) }
      );
    }

    // 9. CORS lockdown — check Origin against user's allowedOrigins
    if (
      user.allowedOrigins.length > 0 &&
      requestOrigin &&
      !user.allowedOrigins.includes(requestOrigin)
    ) {
      return NextResponse.json(
        { error: "Origin not allowed" },
        { status: 403, headers: corsHeaders() }
      );
    }

    // Resolve the allowed origin for response headers
    const resolvedOrigin =
      user.allowedOrigins.length > 0
        ? requestOrigin || user.allowedOrigins[0]
        : "*";

    // 6. Find the view
    const view = await db.view.findUnique({
      where: { userId_slug: { userId: user.id, slug: viewSlug } },
    });

    if (!view) {
      return NextResponse.json(
        { error: "View not found" },
        { status: 404, headers: corsHeaders(resolvedOrigin) }
      );
    }

    // 7. Fetch visible projects ordered by lexoRank
    const projectsOnViews = await db.projectsOnViews.findMany({
      where: { viewId: view.id, isVisible: true },
      include: { project: true },
      orderBy: { lexoRank: "asc" },
    });

    // 8. Map to clean response shape — no internal fields leak
    const projects = projectsOnViews.map((pov) => ({
      id: pov.project.id,
      title: pov.project.title,
      description: pov.project.description,
      techStack: pov.project.techStack,
      repoUrl: pov.project.repoUrl,
      liveUrl: pov.project.liveUrl,
      imageUrl: pov.project.imageUrl,
      createdAt: pov.project.createdAt,
    }));

    return NextResponse.json(projects, {
      headers: {
        ...corsHeaders(resolvedOrigin),
        "Cache-Control":
          "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("GET /api/v1/projects error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: corsHeaders(requestOrigin) }
    );
  }
}
