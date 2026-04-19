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

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(req: Request) {
  try {
    // 1. Extract and validate API key
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401, headers: corsHeaders }
      );
    }

    const rawKey = authHeader.replace("Bearer ", "");
    const keyUserId = await validateApiKey(rawKey);

    if (!keyUserId) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401, headers: corsHeaders }
      );
    }

    // 2. Rate limit by API key prefix (more accurate than IP per client)
    const keyPrefix = rawKey.split("_").slice(0, 3).join("_"); // sk_live_XXXX
    if (ratelimit) {
      const { success } = await ratelimit.limit(keyPrefix);
      if (!success) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Try again shortly." },
          { status: 429, headers: corsHeaders }
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
        { status: 400, headers: corsHeaders }
      );
    }

    // 4. Look up user by username
    const user = await db.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // 5. Verify API key belongs to this user
    if (keyUserId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403, headers: corsHeaders }
      );
    }

    // 6. Find the view
    const view = await db.view.findUnique({
      where: { userId_slug: { userId: user.id, slug: viewSlug } },
    });

    if (!view) {
      return NextResponse.json(
        { error: "View not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // 7. Fetch visible projects ordered by lexoRank
    const projectsOnViews = await db.projectsOnViews.findMany({
      where: { viewId: view.id, isVisible: true },
      include: { project: true },
      orderBy: { lexoRank: "asc" },
    });

    // 8. Map to clean response shape
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
        ...corsHeaders,
        "Cache-Control":
          "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("GET /api/v1/projects error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: corsHeaders }
    );
  }
}

