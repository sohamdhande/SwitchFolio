import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateApiKey, redis } from "@/lib/api-key";
import { logAudit } from "@/lib/audit";

export async function POST(
  req: Request,
  { params }: { params: { keyId: string } }
) {
  try {
    const user = await getOrCreateUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const keyId = params.keyId;

    // Fetch the existing key (only safe fields)
    const existingKey = await db.apiKey.findUnique({
      where: { id: keyId },
      select: {
        id: true,
        userId: true,
        name: true,
        prefix: true,
        permissions: true,
        expiresAt: true,
      },
    });

    if (!existingKey || existingKey.userId !== user.id) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    // Invalidate the old key in Redis cache
    if (redis) {
      await redis.del(`apikey:${existingKey.prefix}`);
    }

    // Generate a new key with the same permissions and expiry
    const { raw, prefix, hashed } = await generateApiKey({
      permissions: existingKey.permissions,
      expiresAt: existingKey.expiresAt,
    });

    // Atomically delete the old key and create the new one
    const [, newKey] = await db.$transaction([
      db.apiKey.delete({ where: { id: keyId } }),
      db.apiKey.create({
        data: {
          userId: user.id,
          name: existingKey.name,
          prefix,
          hashedKey: hashed,
          permissions: existingKey.permissions,
          expiresAt: existingKey.expiresAt,
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
      }),
    ]);

    logAudit({
      userId: user.id,
      action: "api_key.rotated",
      resource: "ApiKey",
      resourceId: newKey.id,
    });

    // Return new raw key — only time it's ever exposed
    return NextResponse.json({ ...newKey, raw }, { status: 201 });
  } catch (error) {
    console.error("POST /api/keys/[keyId]/rotate error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
