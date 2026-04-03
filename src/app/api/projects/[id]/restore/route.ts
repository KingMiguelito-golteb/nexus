// src/app/api/projects/[id]/restore/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST restore a soft-deleted project
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

    const existing = await prisma.project.findFirst({
      where: {
        id,
        userId: session.user.id,
        isDeleted: true,
      },
    })

    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    await prisma.$transaction([
      prisma.project.update({
        where: { id },
        data: {
          isDeleted: false,
          deletedAt: null,
        },
      }),
      prisma.task.updateMany({
        where: { projectId: id },
        data: {
          isDeleted: false,
          deletedAt: null,
        },
      }),
    ])

    await prisma.activity.create({
      data: {
        action: "restored",
        entityType: "project",
        entityId: id,
        details: JSON.stringify({ projectName: existing.name }),
        userId: session.user.id,
        projectId: id,
      },
    })

    return NextResponse.json({ message: "Project restored" })
  } catch (error) {
    console.error("Error restoring project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}