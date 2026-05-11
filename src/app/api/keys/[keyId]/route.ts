import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/api-key";
import { logAudit } from "@/lib/audit";

export async function DELETE(
  req: Request,
  { params }: { params: { keyId: string } }
) {
  try {
    const user = await getOrCreateUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const keyId = params.keyId;

    const existingKey = await db.apiKey.findUnique({
      where: { id: keyId },
      select: { id: true, userId: true, prefix: true },
    });

    if (!existingKey || existingKey.userId !== user.id) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    // Invalidate the Redis cache for this key prefix
    if (redis) {
      await redis.del(`apikey:${existingKey.prefix}`);
    }

    await db.apiKey.delete({
      where: { id: keyId },
    });

    logAudit({
      userId: user.id,
      action: "api_key.deleted",
      resource: "ApiKey",
      resourceId: keyId,
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/keys/[keyId] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
