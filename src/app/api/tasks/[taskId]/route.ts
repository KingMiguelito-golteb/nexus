// src/app/api/tasks/[taskId]/route.ts
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
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { taskId } = await params

    const task = await prisma.task.findFirst({
      where: { id: taskId, isDeleted: false },
      include: {
        project: { select: { userId: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
    })

    if (!task || task.project.userId !== session.user.id) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error("Error fetching task:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { taskId } = await params
    const body = await req.json()

    const existing = await prisma.task.findFirst({
      where: { id: taskId, isDeleted: false },
      include: { project: { select: { userId: true } } },
    })

    if (!existing || existing.project.userId !== session.user.id) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const {
      title, description, status, priority,
      dueDate, estimatedHours, actualHours, cost, tags,
    } = body

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(estimatedHours !== undefined && { estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null }),
        ...(actualHours !== undefined && { actualHours: actualHours ? parseFloat(actualHours) : null }),
        ...(cost !== undefined && { cost: cost ? parseFloat(cost) : 0 }),
        ...(tags !== undefined && { tags: tags?.trim() || null }),
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
      },
    })

    // Auto-sync project spent
    await syncProjectSpent(existing.projectId)

    await prisma.activity.create({
      data: {
        action: "updated",
        entityType: "task",
        entityId: task.id,
        details: JSON.stringify({ taskTitle: task.title }),
        userId: session.user.id,
        projectId: existing.projectId,
        taskId: task.id,
      },
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { taskId } = await params

    const existing = await prisma.task.findFirst({
      where: { id: taskId, isDeleted: false },
      include: { project: { select: { userId: true } } },
    })

    if (!existing || existing.project.userId !== session.user.id) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    await prisma.task.update({
      where: { id: taskId },
      data: { isDeleted: true, deletedAt: new Date() },
    })

    // Auto-sync project spent
    await syncProjectSpent(existing.projectId)

    await prisma.activity.create({
      data: {
        action: "deleted",
        entityType: "task",
        entityId: taskId,
        details: JSON.stringify({ taskTitle: existing.title }),
        userId: session.user.id,
        projectId: existing.projectId,
        taskId: taskId,
      },
    })

    return NextResponse.json({ message: "Task deleted" })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}