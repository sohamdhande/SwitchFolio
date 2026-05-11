import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateApiKey } from "@/lib/api-key";
import { createApiKeySchema, parseBody } from "@/lib/validators";
import { logAudit } from "@/lib/audit";

export async function GET() {
  try {
    const user = await getOrCreateUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const keys = await db.apiKey.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        name: true,
        prefix: true,
        permissions: true,
        expiresAt: true,
        lastUsedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(keys);
  } catch (error) {
    console.error("GET /api/keys error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = parseBody(createApiKeySchema, body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { name, permissions, expiresAt } = parsed.data;
    const { raw, prefix, hashed } = await generateApiKey({ permissions, expiresAt });

    const key = await db.apiKey.create({
      data: {
        userId: user.id,
        name,
        prefix,
        hashedKey: hashed,
        permissions,
        expiresAt,
      },
      select: {
        id: true,
        name: true,
        prefix: true,
        permissions: true,
        expiresAt: true,
        lastUsedAt: true,
        createdAt: true,
      },
    });

    logAudit({
      userId: user.id,
      action: "api_key.created",
      resource: "ApiKey",
      resourceId: key.id,
    });

    // Return with raw key — only time it's ever exposed
    return NextResponse.json({ ...key, raw }, { status: 201 });
  } catch (error) {
    console.error("POST /api/keys error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
