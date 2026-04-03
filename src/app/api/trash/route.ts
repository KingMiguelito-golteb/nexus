// src/app/api/trash/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [deletedProjects, deletedTasks] = await Promise.all([
      prisma.project.findMany({
        where: {
          userId: session.user.id,
          isDeleted: true,
        },
        orderBy: { deletedAt: "desc" },
        select: {
          id: true,
          name: true,
          color: true,
          status: true,
          clientName: true,
          deletedAt: true,
          _count: { select: { tasks: true } },
        },
      }),
      prisma.task.findMany({
        where: {
          isDeleted: true,
          project: {
            userId: session.user.id,
            isDeleted: false, // only tasks whose project is NOT deleted
          },
        },
        orderBy: { deletedAt: "desc" },
        include: {
          project: {
            select: { id: true, name: true, color: true },
          },
        },
      }),
    ])

    return NextResponse.json({
      projects: deletedProjects,
      tasks: deletedTasks,
      totalItems: deletedProjects.length + deletedTasks.length,
    })
  } catch (error) {
    console.error("Trash error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE permanently removes all trash
export async function DELETE() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.$transaction([
      // Delete tasks from deleted projects first
      prisma.task.deleteMany({
        where: {
          project: {
            userId: session.user.id,
            isDeleted: true,
          },
        },
      }),
      // Delete activities from deleted projects
      prisma.activity.deleteMany({
        where: {
          project: {
            userId: session.user.id,
            isDeleted: true,
          },
        },
      }),
      // Delete the projects
      prisma.project.deleteMany({
        where: {
          userId: session.user.id,
          isDeleted: true,
        },
      }),
      // Delete orphaned soft-deleted tasks
      prisma.task.deleteMany({
        where: {
          isDeleted: true,
          project: {
            userId: session.user.id,
          },
        },
      }),
    ])

    return NextResponse.json({ message: "Trash emptied" })
  } catch (error) {
    console.error("Empty trash error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}