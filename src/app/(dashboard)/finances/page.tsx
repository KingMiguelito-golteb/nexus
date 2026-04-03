// src/app/(dashboard)/finances/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  TrendingUp,
  Wallet,
  PiggyBank,
  Clock,
  AlertTriangle,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SpendingTrendChart } from "@/components/finances/spending-trend-chart"
import { CostPriorityChart } from "@/components/finances/cost-priority-chart"
import { ProjectFinancialCard } from "@/components/finances/project-financial-card"

interface FinanceData {
  overview: {
    totalBudget: number
    totalSpent: number
    totalRemaining: number
    budgetUtilization: number
    totalTaskCost: number
    totalProjectSpent: number
    totalEstimatedHours: number
    totalActualHours: number
    projectCount: number
    projectsWithBudget: number
    projectsOverBudget: number
  }
  projectFinancials: {
    id: string
    name: string
    color: string
    status: string
    clientName: string | null
    budget: number
    spent: number
    remaining: number
    utilization: number
    taskCost: number
    estimatedHours: number
    actualHours: number
    totalTasks: number
    completedTasks: number
    progress: number
    costByStatus: { todo: number; inProgress: number; completed: number }
    budgetHealth: "healthy" | "warning" | "critical"
    burnRate: number
    projectedTotal: number
    daysRemaining: number
    topCostTasks: {
      id: string; title: string; cost: number; status: string; priority: string
    }[]
  }[]
  monthlySpending: { month: string; cost: number }[]
  costByPriority: { name: string; value: number; color: string }[]
}

export default function FinancesPage() {
  const [data, setData] = useState<FinanceData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFinances = async () => {
      try {
        const res = await fetch("/api/finances")
        if (!res.ok) throw new Error("Failed to fetch")
        const result = await res.json()
        setData(result)
      } catch (error) {
        console.error("Finance fetch error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFinances()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    )
  }

  if (!data) return null

  const { overview } = data

  const utilizationColor =
    overview.budgetUtilization > 90
      ? "text-red-400"
      : overview.budgetUtilization > 70
        ? "text-amber-400"
        : "text-emerald-400"

  const utilizationBarColor =
    overview.budgetUtilization > 90
      ? "bg-red-500"
      : overview.budgetUtilization > 70
        ? "bg-amber-500"
        : "bg-emerald-500"

  const statCards = [
    {
      title: "Total Budget",
      value: `$${overview.totalBudget.toLocaleString()}`,
      description: `${overview.projectsWithBudget} projects with budget`,
      icon: Wallet,
      color: "text-indigo-400",
      bgColor: "bg-indigo-400/10",
    },
    {
      title: "Total Spent",
      value: `$${overview.totalSpent.toLocaleString()}`,
      description: `${overview.budgetUtilization}% of budget used`,
      icon: TrendingUp,
      color: "text-cyan-400",
      bgColor: "bg-cyan-400/10",
      trend: overview.budgetUtilization > 70 ? "up" : "normal",
    },
    {
      title: "Remaining",
      value: `$${overview.totalRemaining.toLocaleString()}`,
      description: overview.projectsOverBudget > 0
        ? `${overview.projectsOverBudget} over budget`
        : "All within budget",
      icon: PiggyBank,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
    },
    {
      title: "Estimated Hours",
      value: `${overview.totalEstimatedHours}h`,
      description: `${overview.totalActualHours}h actual tracked`,
      icon: Clock,
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
    },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-6 overflow-y-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Finances</h1>
        <p className="text-slate-400 mt-1">
          Track budgets, costs, and financial health across all projects.
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

      {/* Budget Utilization Bar */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-400/10">
                <DollarSign className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold">Overall Budget Utilization</h3>
                <p className="text-sm text-slate-400">
                  ${overview.totalSpent.toLocaleString()} of ${overview.totalBudget.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {overview.budgetUtilization > 70 ? (
                <ArrowUpRight className={cn("w-4 h-4", utilizationColor)} />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-emerald-400" />
              )}
              <span className={cn("text-2xl font-bold", utilizationColor)}>
                {overview.budgetUtilization}%
              </span>
            </div>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", utilizationBarColor)}
              style={{ width: `${Math.min(100, overview.budgetUtilization)}%` }}
            />
          </div>
          <div className="flex items-center gap-6 mt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              Task costs: ${overview.totalTaskCost.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              Direct spending: ${overview.totalProjectSpent.toLocaleString()}
            </span>
            {overview.projectsOverBudget > 0 && (
              <span className="flex items-center gap-1 text-red-400">
                <AlertTriangle className="w-3 h-3" />
                {overview.projectsOverBudget} project{overview.projectsOverBudget > 1 ? "s" : ""} over budget
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SpendingTrendChart data={data.monthlySpending} />
        <CostPriorityChart data={data.costByPriority} />
      </div>

      {/* Project Financial Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Project Financials</h2>
        {data.projectFinancials.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-800 border-dashed">
            <CardContent className="p-12 text-center">
              <DollarSign className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="font-semibold text-lg">No projects yet</h3>
              <p className="text-slate-400 mt-1">
                Create projects and add budgets to see financial data
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data.projectFinancials.map((project) => (
              <ProjectFinancialCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}