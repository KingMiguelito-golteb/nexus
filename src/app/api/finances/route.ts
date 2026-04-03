// src/app/api/finances/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const projects = await prisma.project.findMany({
      where: { userId, isDeleted: false },
      include: {
        tasks: {
          where: { isDeleted: false },
          orderBy: { cost: "desc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    })

    // Overall financial stats
    const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0)
    const totalProjectSpent = projects.reduce((acc, p) => acc + p.spent, 0)
    const totalTaskCost = projects.reduce(
      (acc, p) => acc + p.tasks.reduce((a, t) => a + t.cost, 0),
      0
    )
    const totalSpent = totalProjectSpent + totalTaskCost
    const totalRemaining = Math.max(0, totalBudget - totalSpent)
    const budgetUtilization = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0

    // Total estimated vs actual hours
    const totalEstimatedHours = projects.reduce(
      (acc, p) =>
        acc + p.tasks.reduce((a, t) => a + (t.estimatedHours || 0), 0),
      0
    )
    const totalActualHours = projects.reduce(
      (acc, p) =>
        acc + p.tasks.reduce((a, t) => a + (t.actualHours || 0), 0),
      0
    )

    // Per-project financial data
    const projectFinancials = projects.map((p) => {
      const taskCost = p.tasks.reduce((a, t) => a + t.cost, 0)
      const spent = p.spent + taskCost
      const remaining = Math.max(0, p.budget - spent)
      const utilization = p.budget > 0 ? Math.round((spent / p.budget) * 100) : 0
      const estimatedHours = p.tasks.reduce((a, t) => a + (t.estimatedHours || 0), 0)
      const actualHours = p.tasks.reduce((a, t) => a + (t.actualHours || 0), 0)

      const totalTasks = p.tasks.length
      const completedTasks = p.tasks.filter((t) => t.status === "completed").length
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

      // Cost per task status
      const costByStatus = {
        todo: p.tasks
          .filter((t) => t.status === "todo")
          .reduce((a, t) => a + t.cost, 0),
        inProgress: p.tasks
          .filter((t) => t.status === "in_progress")
          .reduce((a, t) => a + t.cost, 0),
        completed: p.tasks
          .filter((t) => t.status === "completed")
          .reduce((a, t) => a + t.cost, 0),
      }

      // Budget health
      let budgetHealth: "healthy" | "warning" | "critical" = "healthy"
      if (utilization > 90) budgetHealth = "critical"
      else if (utilization > 70) budgetHealth = "warning"

      // Burn rate: if project has dates, calculate daily burn
      let burnRate = 0
      let projectedTotal = 0
      let daysRemaining = 0
      if (p.startDate && p.endDate) {
        const start = new Date(p.startDate)
        const end = new Date(p.endDate)
        const now = new Date()
        const elapsed = Math.max(1, Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
        const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
        daysRemaining = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

        burnRate = spent / elapsed
        projectedTotal = burnRate * totalDays
      }

      // Top cost tasks
      const topCostTasks = p.tasks
        .filter((t) => t.cost > 0)
        .slice(0, 5)
        .map((t) => ({
          id: t.id,
          title: t.title,
          cost: t.cost,
          status: t.status,
          priority: t.priority,
          estimatedHours: t.estimatedHours,
          actualHours: t.actualHours,
        }))

      return {
        id: p.id,
        name: p.name,
        color: p.color,
        status: p.status,
        clientName: p.clientName,
        budget: p.budget,
        spent,
        remaining,
        utilization,
        taskCost,
        estimatedHours,
        actualHours,
        totalTasks,
        completedTasks,
        progress,
        costByStatus,
        budgetHealth,
        burnRate,
        projectedTotal,
        daysRemaining,
        startDate: p.startDate,
        endDate: p.endDate,
        topCostTasks,
      }
    })

    // Monthly spending trend (last 6 months based on task creation)
    const allTasks = projects.flatMap((p) => p.tasks)
    const monthlySpending = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      const monthName = monthStart.toLocaleDateString("en-US", { month: "short" })

      const monthCost = allTasks
        .filter((t) => {
          const d = new Date(t.createdAt)
          return d >= monthStart && d <= monthEnd
        })
        .reduce((a, t) => a + t.cost, 0)

      monthlySpending.push({ month: monthName, cost: monthCost })
    }

    // Cost by priority
    const costByPriority = [
      {
        name: "Low",
        value: allTasks.filter((t) => t.priority === "low").reduce((a, t) => a + t.cost, 0),
        color: "#94a3b8",
      },
      {
        name: "Medium",
        value: allTasks.filter((t) => t.priority === "medium").reduce((a, t) => a + t.cost, 0),
        color: "#60a5fa",
      },
      {
        name: "High",
        value: allTasks.filter((t) => t.priority === "high").reduce((a, t) => a + t.cost, 0),
        color: "#fb923c",
      },
      {
        name: "Critical",
        value: allTasks.filter((t) => t.priority === "critical").reduce((a, t) => a + t.cost, 0),
        color: "#f87171",
      },
    ]

    return NextResponse.json({
      overview: {
        totalBudget,
        totalSpent,
        totalRemaining,
        budgetUtilization,
        totalTaskCost,
        totalProjectSpent,
        totalEstimatedHours,
        totalActualHours,
        projectCount: projects.length,
        projectsWithBudget: projects.filter((p) => p.budget > 0).length,
        projectsOverBudget: projectFinancials.filter((p) => p.utilization > 100).length,
      },
      projectFinancials,
      monthlySpending,
      costByPriority,
    })
  } catch (error) {
    console.error("Finance error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}