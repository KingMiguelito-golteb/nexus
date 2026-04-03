// src/app/api/projects/[id]/tasks/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function syncProjectSpent(projectId: string) {
  const tasks = await prisma.task.findMany({
    where: { projectId, isDeleted: false },
    select: { cost: true },
  })
  const totalCost = tasks.reduce((acc, t) => acc + t.cost, 0)
  await prisma.project.update({
    where: { id: projectId },
    data: { spent: totalCost },
  })
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const project = await prisma.project.findFirst({
      where: { id, userId: session.user.id, isDeleted: false },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const tasks = await prisma.task.findMany({
      where: { projectId: id, isDeleted: false },
      orderBy: { position: "asc" },
      include: {
        assignee: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()

    const project = await prisma.project.findFirst({
      where: { id, userId: session.user.id, isDeleted: false },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const {
      title,
      description,
      status,
      priority,
      dueDate,
      estimatedHours,
      cost,
      tags,
    } = body

    if (!title || title.trim() === "") {
      return NextResponse.json({ error: "Task title is required" }, { status: 400 })
    }

    const maxPositionTask = await prisma.task.findFirst({
      where: {
        projectId: id,
        status: status || "todo",
        isDeleted: false,
      },
      orderBy: { position: "desc" },
      select: { position: true },
    })

    const newPosition = (maxPositionTask?.position ?? -1) + 1

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status: status || "todo",
        priority: priority || "medium",
        position: newPosition,
        dueDate: dueDate ? new Date(dueDate) : null,
        estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null,
        cost: cost ? parseFloat(cost) : 0,
        tags: tags?.trim() || null,
        projectId: id,
        assigneeId: session.user.id,
      },
      include: {
        assignee: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    // Auto-sync project spent
    await syncProjectSpent(id)

    await prisma.activity.create({
      data: {
        action: "created",
        entityType: "task",
        entityId: task.id,
        details: JSON.stringify({ taskTitle: task.title, status: task.status }),
        userId: session.user.id,
        projectId: id,
        taskId: task.id,
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}