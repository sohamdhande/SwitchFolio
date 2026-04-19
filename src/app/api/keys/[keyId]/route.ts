import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { db } from "@/lib/db";

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
    });

    if (!existingKey || existingKey.userId !== user.id) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    await db.apiKey.delete({
      where: { id: keyId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/keys/[keyId] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
