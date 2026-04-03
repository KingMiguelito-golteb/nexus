import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// PUT move task to a different column/position
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
    const { status, position } = await req.json()

    const existing = await prisma.task.findFirst({
      where: { id: taskId, isDeleted: false },
      include: {
        project: { select: { userId: true, id: true } },
      },
    })

    if (!existing || existing.project.userId !== session.user.id) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const oldStatus = existing.status
    const newStatus = status || existing.status

    // If moving to a new column, update positions
    if (oldStatus !== newStatus) {
      // Decrease positions of tasks after this one in the old column
      await prisma.task.updateMany({
        where: {
          projectId: existing.projectId,
          status: oldStatus,
          position: { gt: existing.position },
          isDeleted: false,
        },
        data: {
          position: { decrement: 1 },
        },
      })

      // Increase positions of tasks at and after the target position in new column
      await prisma.task.updateMany({
        where: {
          projectId: existing.projectId,
          status: newStatus,
          position: { gte: position ?? 0 },
          isDeleted: false,
        },
        data: {
          position: { increment: 1 },
        },
      })
    } else {
      // Same column reorder
      const oldPos = existing.position
      const newPos = position ?? 0

      if (oldPos < newPos) {
        await prisma.task.updateMany({
          where: {
            projectId: existing.projectId,
            status: newStatus,
            position: { gt: oldPos, lte: newPos },
            id: { not: taskId },
            isDeleted: false,
          },
          data: {
            position: { decrement: 1 },
          },
        })
      } else if (oldPos > newPos) {
        await prisma.task.updateMany({
          where: {
            projectId: existing.projectId,
            status: newStatus,
            position: { gte: newPos, lt: oldPos },
            id: { not: taskId },
            isDeleted: false,
          },
          data: {
            position: { increment: 1 },
          },
        })
      }
    }

    // Update the task itself
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        status: newStatus,
        position: position ?? 0,
      },
      include: {
        assignee: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    // Log activity if status changed
    if (oldStatus !== newStatus) {
      await prisma.activity.create({
        data: {
          action: "moved",
          entityType: "task",
          entityId: taskId,
          details: JSON.stringify({
            taskTitle: task.title,
            from: oldStatus,
            to: newStatus,
          }),
          userId: session.user.id,
          projectId: existing.projectId,
          taskId: taskId,
        },
      })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error("Error moving task:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}