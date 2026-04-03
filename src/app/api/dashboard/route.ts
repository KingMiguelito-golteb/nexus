// src/app/api/dashboard/route.ts
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

    // Fetch all projects with tasks
    const projects = await prisma.project.findMany({
      where: { userId, isDeleted: false },
      include: {
        tasks: {
          where: { isDeleted: false },
        },
      },
      orderBy: { updatedAt: "desc" },
    })

    // Project stats
    const totalProjects = projects.length
    const activeProjects = projects.filter((p) => p.status === "active").length
    const completedProjects = projects.filter((p) => p.status === "completed").length
    const onHoldProjects = projects.filter((p) => p.status === "on_hold").length

    // Task stats
    const allTasks = projects.flatMap((p) => p.tasks)
    const totalTasks = allTasks.length
    const todoTasks = allTasks.filter((t) => t.status === "todo").length
    const inProgressTasks = allTasks.filter((t) => t.status === "in_progress").length
    const completedTasks = allTasks.filter((t) => t.status === "completed").length

    // Overdue tasks
    const now = new Date()
    const overdueTasks = allTasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== "completed"
    ).length

    // Financial stats
    const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0)
    const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0)
    const totalTaskCost = allTasks.reduce((acc, t) => acc + t.cost, 0)

    // Overall progress
    const overallProgress = totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0

    // Task distribution for pie chart
    const taskDistribution = [
      { name: "To Do", value: todoTasks, color: "#94a3b8" },
      { name: "In Progress", value: inProgressTasks, color: "#fbbf24" },
      { name: "Completed", value: completedTasks, color: "#34d399" },
    ]

    // Priority distribution
    const priorityDistribution = [
      { name: "Low", value: allTasks.filter((t) => t.priority === "low").length, color: "#94a3b8" },
      { name: "Medium", value: allTasks.filter((t) => t.priority === "medium").length, color: "#60a5fa" },
      { name: "High", value: allTasks.filter((t) => t.priority === "high").length, color: "#fb923c" },
      { name: "Critical", value: allTasks.filter((t) => t.priority === "critical").length, color: "#f87171" },
    ]

    // Per-project breakdown for bar chart
    const projectBreakdown = projects.slice(0, 8).map((p) => {
      const pTasks = p.tasks.length
      const pCompleted = p.tasks.filter((t) => t.status === "completed").length
      const pInProgress = p.tasks.filter((t) => t.status === "in_progress").length
      const pTodo = p.tasks.filter((t) => t.status === "todo").length
      const pProgress = pTasks > 0 ? Math.round((pCompleted / pTasks) * 100) : 0

      return {
        name: p.name.length > 15 ? p.name.slice(0, 15) + "…" : p.name,
        fullName: p.name,
        todo: pTodo,
        inProgress: pInProgress,
        completed: pCompleted,
        progress: pProgress,
        budget: p.budget,
        spent: p.spent,
        color: p.color,
        id: p.id,
      }
    })

    // Budget per project for bar chart
    const budgetBreakdown = projects
      .filter((p) => p.budget > 0)
      .slice(0, 8)
      .map((p) => {
        const taskCost = p.tasks.reduce((acc, t) => acc + t.cost, 0)
        return {
          name: p.name.length > 15 ? p.name.slice(0, 15) + "…" : p.name,
          fullName: p.name,
          budget: p.budget,
          spent: p.spent + taskCost,
          remaining: Math.max(0, p.budget - p.spent - taskCost),
          color: p.color,
        }
      })

    // Recent activity
    const recentActivity = await prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 15,
      include: {
        user: { select: { name: true } },
        project: { select: { name: true, color: true } },
      },
    })

    // Tasks completed over last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const weeklyData = []
    for (let i = 0; i < 7; i++) {
      const dayStart = new Date(sevenDaysAgo)
      dayStart.setDate(dayStart.getDate() + i)
      const dayEnd = new Date(dayStart)
      dayEnd.setDate(dayEnd.getDate() + 1)

      const dayName = dayStart.toLocaleDateString("en-US", { weekday: "short" })

      const created = allTasks.filter((t) => {
        const d = new Date(t.createdAt)
        return d >= dayStart && d < dayEnd
      }).length

      const completed = allTasks.filter((t) => {
        const d = new Date(t.updatedAt)
        return d >= dayStart && d < dayEnd && t.status === "completed"
      }).length

      weeklyData.push({ day: dayName, created, completed })
    }

    // Project health overview
    const healthOverview = projects
      .filter((p) => p.status === "active")
      .map((p) => {
        const pTasks = p.tasks.length
        const pCompleted = p.tasks.filter((t) => t.status === "completed").length
        const progress = pTasks > 0 ? Math.round((pCompleted / pTasks) * 100) : 0

        let health: "on_track" | "at_risk" | "behind" = "on_track"
        if (p.endDate) {
          const end = new Date(p.endDate)
          const start = new Date(p.startDate)
          const totalDuration = end.getTime() - start.getTime()
          const elapsed = now.getTime() - start.getTime()
          const timeProgress = totalDuration > 0 ? Math.round((elapsed / totalDuration) * 100) : 0

          if (progress < timeProgress - 20) health = "behind"
          else if (progress < timeProgress - 5) health = "at_risk"
        }

        return {
          id: p.id,
          name: p.name,
          color: p.color,
          progress,
          health,
          totalTasks: pTasks,
          completedTasks: pCompleted,
          endDate: p.endDate,
        }
      })

    return NextResponse.json({
      stats: {
        totalProjects,
        activeProjects,
        completedProjects,
        onHoldProjects,
        totalTasks,
        todoTasks,
        inProgressTasks,
        completedTasks,
        overdueTasks,
        totalBudget,
        totalSpent,
        totalTaskCost,
        overallProgress,
      },
      taskDistribution,
      priorityDistribution,
      projectBreakdown,
      budgetBreakdown,
      weeklyData,
      healthOverview,
      recentActivity,
    })
  } catch (error) {
    console.error("Dashboard error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}