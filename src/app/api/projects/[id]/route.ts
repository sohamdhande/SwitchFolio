import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateProjectSchema, parseBody } from "@/lib/validators";
import { logAudit } from "@/lib/audit";

const projectSelect = {
  id: true,
  userId: true,
  title: true,
  description: true,
  techStack: true,
  repoUrl: true,
  liveUrl: true,
  imageUrl: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const parsed = parseBody(updateProjectSchema, body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const project = await db.project.findUnique({
      where: { id: params.id },
      select: { id: true, userId: true },
    });

    if (!project || project.userId !== user.id) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    const { title, description, techStack, repoUrl, liveUrl, imageUrl } = parsed.data;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (techStack !== undefined) updateData.techStack = techStack;
    if (repoUrl !== undefined) updateData.repoUrl = repoUrl;
    if (liveUrl !== undefined) updateData.liveUrl = liveUrl;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    const updatedProject = await db.project.update({
      where: { id: params.id },
      data: updateData,
      select: projectSelect,
    });

    logAudit({
      userId: user.id,
      action: "project.updated",
      resource: "Project",
      resourceId: params.id,
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("PUT /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getOrCreateUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await db.project.findUnique({
      where: { id: params.id },
      select: { id: true, userId: true },
    });

    if (!project || project.userId !== user.id) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await db.project.delete({
      where: { id: params.id },
    });

    logAudit({
      userId: user.id,
      action: "project.deleted",
      resource: "Project",
      resourceId: params.id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
