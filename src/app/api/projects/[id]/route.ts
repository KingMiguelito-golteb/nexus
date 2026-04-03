// src/app/api/projects/[id]/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET single project with all tasks
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
      where: {
        id,
        userId: session.user.id,
        isDeleted: false,
      },
      include: {
        tasks: {
          where: { isDeleted: false },
          orderBy: { position: "asc" },
        },
        activities: {
          orderBy: { createdAt: "desc" },
          take: 20,
          include: {
            user: {
              select: { name: true },
            },
          },
        },
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Compute stats
    const totalTasks = project.tasks.length
    const completedTasks = project.tasks.filter((t) => t.status === "completed").length
    const inProgressTasks = project.tasks.filter((t) => t.status === "in_progress").length
    const todoTasks = project.tasks.filter((t) => t.status === "todo").length
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    const totalCost = project.tasks.reduce((acc, t) => acc + t.cost, 0)

    return NextResponse.json({
      ...project,
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      progress,
      totalCost,
    })
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT update project
export async function PUT(
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

    // Verify ownership
    const existing = await prisma.project.findFirst({
      where: {
        id,
        userId: session.user.id,
        isDeleted: false,
      },
    })

    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const {
      name,
      description,
      status,
      priority,
      budget,
      spent,
      startDate,
      endDate,
      clientName,
      clientEmail,
      color,
    } = body

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(budget !== undefined && { budget: parseFloat(budget) || 0 }),
        ...(spent !== undefined && { spent: parseFloat(spent) || 0 }),
        ...(startDate !== undefined && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(clientName !== undefined && { clientName: clientName?.trim() || null }),
        ...(clientEmail !== undefined && { clientEmail: clientEmail?.trim() || null }),
        ...(color !== undefined && { color }),
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        action: "updated",
        entityType: "project",
        entityId: project.id,
        details: JSON.stringify({ projectName: project.name }),
        userId: session.user.id,
        projectId: project.id,
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE (soft delete) project
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Verify ownership
    const existing = await prisma.project.findFirst({
      where: {
        id,
        userId: session.user.id,
        isDeleted: false,
      },
    })

    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Soft delete project and its tasks
    await prisma.$transaction([
      prisma.project.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      }),
      prisma.task.updateMany({
        where: { projectId: id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      }),
    ])

    // Log activity
    await prisma.activity.create({
      data: {
        action: "deleted",
        entityType: "project",
        entityId: id,
        details: JSON.stringify({ projectName: existing.name }),
        userId: session.user.id,
        projectId: id,
      },
    })

    return NextResponse.json({ message: "Project deleted" })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}