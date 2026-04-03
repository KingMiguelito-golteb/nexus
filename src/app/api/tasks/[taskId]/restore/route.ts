// src/app/api/tasks/[taskId]/restore/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
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
      where: { id: taskId, isDeleted: true },
      include: {
        project: { select: { userId: true } },
      },
    })

    if (!existing || existing.project.userId !== session.user.id) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    await prisma.task.update({
      where: { id: taskId },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    })

    await prisma.activity.create({
      data: {
        action: "restored",
        entityType: "task",
        entityId: taskId,
        details: JSON.stringify({ taskTitle: existing.title }),
        userId: session.user.id,
        projectId: existing.projectId,
        taskId: taskId,
      },
    })

    return NextResponse.json({ message: "Task restored" })
  } catch (error) {
    console.error("Error restoring task:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}