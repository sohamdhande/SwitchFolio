import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getOrCreateUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, techStack, repoUrl, liveUrl, imageUrl } = body;

    const project = await db.project.findUnique({
      where: { id: params.id },
    });

    if (!project || project.userId !== user.id) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const updatedProject = await db.project.update({
      where: { id: params.id },
      data: {
        title: title ?? project.title,
        description: description ?? project.description,
        techStack: techStack ?? project.techStack,
        repoUrl: repoUrl !== undefined ? (repoUrl || null) : project.repoUrl,
        liveUrl: liveUrl !== undefined ? (liveUrl || null) : project.liveUrl,
        imageUrl: imageUrl !== undefined ? (imageUrl || null) : project.imageUrl,
      },
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
    });

    if (!project || project.userId !== user.id) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await db.project.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
