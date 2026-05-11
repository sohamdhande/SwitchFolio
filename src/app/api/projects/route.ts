import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { createProjectSchema, parseBody } from "@/lib/validators";
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

export async function GET() {
  try {
    const user = await getOrCreateUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await db.project.findMany({
      where: { userId: user.id },
      select: projectSelect,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /api/projects error:", error);
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

    const parsed = parseBody(createProjectSchema, body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { title, description, techStack, repoUrl, liveUrl, imageUrl } = parsed.data;

    const newProject = await db.project.create({
      data: {
        userId: user.id,
        title,
        description,
        techStack,
        repoUrl,
        liveUrl,
        imageUrl,
      },
      select: projectSelect,
    });

    logAudit({
      userId: user.id,
      action: "project.created",
      resource: "Project",
      resourceId: newProject.id,
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
