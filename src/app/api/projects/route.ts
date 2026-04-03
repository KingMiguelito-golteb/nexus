import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET all projects for the logged-in user
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: session.user.id,
        isDeleted: false,
      },
      include: {
        tasks: {
          where: { isDeleted: false },
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    })

    // Add computed fields
    const projectsWithStats = projects.map((project) => {
      const totalTasks = project.tasks.length
      const completedTasks = project.tasks.filter((t) => t.status === "completed").length
      const inProgressTasks = project.tasks.filter((t) => t.status === "in_progress").length
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

      let health: "on_track" | "at_risk" | "behind" = "on_track"
      if (project.endDate) {
        const now = new Date()
        const end = new Date(project.endDate)
        const start = new Date(project.startDate)
        const totalDuration = end.getTime() - start.getTime()
        const elapsed = now.getTime() - start.getTime()
        const timeProgress = totalDuration > 0 ? Math.round((elapsed / totalDuration) * 100) : 0

        if (progress < timeProgress - 20) health = "behind"
        else if (progress < timeProgress - 5) health = "at_risk"
      }

      return {
        ...project,
        totalTasks,
        completedTasks,
        inProgressTasks,
        progress,
        health,
      }
    })

    return NextResponse.json(projectsWithStats)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST create a new project
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const {
      name,
      description,
      status,
      priority,
      budget,
      startDate,
      endDate,
      clientName,
      clientEmail,
      color,
    } = body

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 })
    }

    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        status: status || "active",
        priority: priority || "medium",
        budget: parseFloat(budget) || 0,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        clientName: clientName?.trim() || null,
        clientEmail: clientEmail?.trim() || null,
        color: color || "#6366f1",
        userId: session.user.id,
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        action: "created",
        entityType: "project",
        entityId: project.id,
        details: JSON.stringify({ projectName: project.name }),
        userId: session.user.id,
        projectId: project.id,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}