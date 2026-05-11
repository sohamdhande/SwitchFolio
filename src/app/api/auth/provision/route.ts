import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateApiKey } from "@/lib/api-key";

export async function POST() {
  try {
    const user = await getOrCreateUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (user.setupComplete) {
      return NextResponse.json({ error: "Setup already complete" }, { status: 400 });
    }

    // Check if default view exists
    let view = await db.view.findFirst({ where: { userId: user.id, slug: "default" } });
    if (!view) {
      view = await db.view.create({
        data: { userId: user.id, name: "Default", slug: "default" }
      });
    }

    // Check if key exists
    let key = await db.apiKey.findFirst({ where: { userId: user.id, name: "My Portfolio" } });
    let rawKey = null;
    if (!key) {
      const { raw, prefix, hashed, permissions, expiresAt } = await generateApiKey({
        permissions: ["read:projects"],
        expiresAt: null
      });

      key = await db.apiKey.create({
        data: {
          userId: user.id,
          name: "My Portfolio",
          prefix,
          hashedKey: hashed,
          permissions,
          expiresAt
        }
      });
      rawKey = raw;

      // Ensure allowedOrigins is updated
      if (!user.allowedOrigins.includes("*")) {
        await db.user.update({
          where: { id: user.id },
          data: { allowedOrigins: ["*"] }
        });
      }
    }

    return NextResponse.json({
      rawKey,
      username: user.username,
      viewSlug: view.slug
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH() {
  try {
    const user = await getOrCreateUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await db.user.update({
      where: { id: user.id },
      data: { setupComplete: true }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
