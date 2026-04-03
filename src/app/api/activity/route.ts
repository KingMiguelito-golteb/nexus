// src/app/api/activity/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "30")
    const action = searchParams.get("action") // filter by action
    const entityType = searchParams.get("entityType") // filter by entity type
    const projectId = searchParams.get("projectId") // filter by project

    const where: Record<string, unknown> = {
      userId: session.user.id,
    }

    if (action && action !== "all") {
      where.action = action
    }
    if (entityType && entityType !== "all") {
      where.entityType = entityType
    }
    if (projectId && projectId !== "all") {
      where.projectId = projectId
    }

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: { select: { name: true, email: true } },
          project: { select: { id: true, name: true, color: true } },
        },
      }),
      prisma.activity.count({ where }),
    ])

    // Group by date
    const grouped: Record<string, typeof activities> = {}
    activities.forEach((activity) => {
      const date = new Date(activity.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      if (!grouped[date]) grouped[date] = []
      grouped[date].push(activity)
    })

    return NextResponse.json({
      activities,
      grouped,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Activity error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}