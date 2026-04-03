// src/app/api/projects/[id]/sync-costs/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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

    const project = await prisma.project.findFirst({
      where: { id, userId: session.user.id, isDeleted: false },
      include: {
        tasks: {
          where: { isDeleted: false },
        },
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const totalTaskCost = project.tasks.reduce((acc, t) => acc + t.cost, 0)

    const updated = await prisma.project.update({
      where: { id },
      data: { spent: totalTaskCost },
    })

    return NextResponse.json({ spent: updated.spent })
  } catch (error) {
    console.error("Sync costs error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}