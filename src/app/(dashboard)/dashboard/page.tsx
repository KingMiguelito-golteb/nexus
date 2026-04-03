// src/app/(dashboard)/dashboard/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  ListTodo,
  Loader2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TaskDistributionChart } from "@/components/dashboard/task-distribution-chart"
import { PriorityChart } from "@/components/dashboard/priority-chart"
import { ProjectProgressChart } from "@/components/dashboard/project-progress-chart"
import { WeeklyActivityChart } from "@/components/dashboard/weekly-activity-chart"
import { BudgetChart } from "@/components/dashboard/budget-chart"
import { HealthOverview } from "@/components/dashboard/health-overview"
import { ActivityFeed } from "@/components/dashboard/activity-feed"

interface DashboardData {
  stats: {
    totalProjects: number
    activeProjects: number
    completedProjects: number
    totalTasks: number
    todoTasks: number
    inProgressTasks: number
    completedTasks: number
    overdueTasks: number
    totalBudget: number
    totalSpent: number
    totalTaskCost: number
    overallProgress: number
  }
  taskDistribution: { name: string; value: number; color: string }[]
  priorityDistribution: { name: string; value: number; color: string }[]
  projectBreakdown: {
    name: string; fullName: string; todo: number; inProgress: number;
    completed: number; progress: number; color: string
  }[]
  budgetBreakdown: {
    name: string; fullName: string; budget: number; spent: number;
    remaining: number; color: string
  }[]
  weeklyData: { day: string; created: number; completed: number }[]
  healthOverview: {
    id: string; name: string; color: string; progress: number;
    health: "on_track" | "at_risk" | "behind";
    totalTasks: number; completedTasks: number; endDate: string | null
  }[]
  recentActivity: {
    id: string; action: string; entityType: string; entityId: string;
    details: string | null; createdAt: string;
    user: { name: string };
    project: { name: string; color: string } | null
  }[]
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/dashboard")
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setDashboard(data)
      } catch (error) {
        console.error("Dashboard fetch error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <div className="h-8 w-64 bg-slate-800/80 rounded animate-pulse" />
          <div className="h-4 w-48 bg-slate-800/80 rounded animate-pulse mt-2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <Card key={i} className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-slate-800/80 rounded animate-pulse" />
                    <div className="h-7 w-16 bg-slate-800/80 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-slate-800/80 rounded animate-pulse" />
                  </div>
                  <div className="h-11 w-11 bg-slate-800/80 rounded-xl animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!dashboard) return null

  const { stats } = dashboard

  const statCards = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      description: `${stats.activeProjects} active, ${stats.completedProjects} done`,
      icon: FolderKanban,
      color: "text-indigo-400",
      bgColor: "bg-indigo-400/10",
    },
    {
      title: "Tasks Completed",
      value: stats.completedTasks,
      description: `of ${stats.totalTasks} total tasks`,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
    },
    {
      title: "In Progress",
      value: stats.inProgressTasks,
      description: `${stats.overdueTasks} overdue`,
      icon: Clock,
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
    },
    {
      title: "Total Budget",
      value: `$${stats.totalBudget.toLocaleString()}`,
      description: `$${(stats.totalSpent + stats.totalTaskCost).toLocaleString()} used`,
      icon: DollarSign,
      color: "text-cyan-400",
      bgColor: "bg-cyan-400/10",
    },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-6 overflow-y-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {session?.user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-400 mt-1">
          Here&apos;s what&apos;s happening across your projects.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overall Progress */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-400/10">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold">Overall Progress</h3>
                <p className="text-sm text-slate-400">Across all active projects</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-indigo-400">
              {stats.overallProgress}%
            </span>
          </div>
          <Progress value={stats.overallProgress} className="h-3 bg-slate-800" />
          <div className="flex items-center gap-6 mt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <ListTodo className="w-3 h-3" /> {stats.todoTasks} to do
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" /> {stats.inProgressTasks} in progress
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {stats.completedTasks} completed
            </span>
            {stats.overdueTasks > 0 && (
              <span className="flex items-center gap-1 text-red-400">
                <AlertTriangle className="w-3 h-3" /> {stats.overdueTasks} overdue
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskDistributionChart data={dashboard.taskDistribution} />
        <PriorityChart data={dashboard.priorityDistribution} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WeeklyActivityChart data={dashboard.weeklyData} />
        <ProjectProgressChart data={dashboard.projectBreakdown} />
      </div>

      {/* Budget Chart */}
      <BudgetChart data={dashboard.budgetBreakdown} />

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <HealthOverview data={dashboard.healthOverview} />
        <ActivityFeed data={dashboard.recentActivity} />
      </div>
    </div>
  )
}