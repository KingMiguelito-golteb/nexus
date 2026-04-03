// src/components/finances/project-financial-card.tsx
"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Flame,
  Calendar,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ProjectFinancial {
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
  costByStatus: {
    todo: number
    inProgress: number
    completed: number
  }
  budgetHealth: "healthy" | "warning" | "critical"
  burnRate: number
  projectedTotal: number
  daysRemaining: number
  topCostTasks: {
    id: string
    title: string
    cost: number
    status: string
    priority: string
  }[]
}

interface ProjectFinancialCardProps {
  project: ProjectFinancial
}

const healthConfig = {
  healthy: { label: "Healthy", class: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20", icon: CheckCircle2 },
  warning: { label: "Warning", class: "bg-amber-400/10 text-amber-400 border-amber-400/20", icon: AlertTriangle },
  critical: { label: "Over Budget", class: "bg-red-400/10 text-red-400 border-red-400/20", icon: Flame },
}

const statusPriorityColors: Record<string, string> = {
  todo: "text-slate-400",
  in_progress: "text-amber-400",
  completed: "text-emerald-400",
  low: "text-slate-400",
  medium: "text-blue-400",
  high: "text-orange-400",
  critical: "text-red-400",
}

export function ProjectFinancialCard({ project }: ProjectFinancialCardProps) {
  const health = healthConfig[project.budgetHealth]
  const HealthIcon = health.icon

  const budgetBarColor = project.utilization > 100
    ? "bg-red-500"
    : project.utilization > 70
      ? "bg-amber-500"
      : "bg-emerald-500"

  return (
    <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <Link href={`/projects/${project.id}`}>
            <div className="flex items-center gap-2 group">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: project.color }}
              />
              <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                {project.name}
              </h3>
            </div>
          </Link>
          <Badge variant="outline" className={health.class}>
            <HealthIcon className="w-3 h-3 mr-1" />
            {health.label}
          </Badge>
        </div>

        {project.clientName && (
          <p className="text-xs text-slate-500 -mt-2 mb-3 ml-5">
            {project.clientName}
          </p>
        )}

        {/* Budget Bar */}
        {project.budget > 0 ? (
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Budget Usage</span>
              <span className={cn("font-medium", project.utilization > 100 ? "text-red-400" : "text-white")}>
                {project.utilization}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all", budgetBarColor)}
                style={{ width: `${Math.min(100, project.utilization)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>${project.spent.toLocaleString()} spent</span>
              <span>${project.budget.toLocaleString()} budget</span>
            </div>
          </div>
        ) : (
          <div className="mb-4 p-3 rounded-lg bg-slate-800/30 text-center">
            <p className="text-xs text-slate-500">No budget set</p>
          </div>
        )}

        {/* Financial Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-2.5 rounded-lg bg-slate-800/30">
            <div className="flex items-center gap-1.5 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] text-slate-500 uppercase">Remaining</span>
            </div>
            <p className="text-sm font-semibold text-emerald-400">
              ${project.remaining.toLocaleString()}
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-800/30">
            <div className="flex items-center gap-1.5 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] text-slate-500 uppercase">Task Costs</span>
            </div>
            <p className="text-sm font-semibold text-cyan-400">
              ${project.taskCost.toLocaleString()}
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-800/30">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10px] text-slate-500 uppercase">Est. Hours</span>
            </div>
            <p className="text-sm font-semibold text-indigo-400">
              {project.estimatedHours}h
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-800/30">
            <div className="flex items-center gap-1.5 mb-1">
              {project.burnRate > 0 ? (
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span className="text-[10px] text-slate-500 uppercase">Burn Rate</span>
            </div>
            <p className="text-sm font-semibold text-amber-400">
              ${project.burnRate > 0 ? project.burnRate.toFixed(0) : "0"}/day
            </p>
          </div>
        </div>

        {/* Cost by Status */}
        {project.taskCost > 0 && (
          <div className="mb-4">
            <p className="text-xs text-slate-500 mb-2">Cost by Status</p>
            <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-slate-800">
              {project.costByStatus.completed > 0 && (
                <div
                  className="bg-emerald-500 h-full"
                  style={{
                    width: `${(project.costByStatus.completed / project.taskCost) * 100}%`,
                  }}
                  title={`Completed: $${project.costByStatus.completed}`}
                />
              )}
              {project.costByStatus.inProgress > 0 && (
                <div
                  className="bg-amber-500 h-full"
                  style={{
                    width: `${(project.costByStatus.inProgress / project.taskCost) * 100}%`,
                  }}
                  title={`In Progress: $${project.costByStatus.inProgress}`}
                />
              )}
              {project.costByStatus.todo > 0 && (
                <div
                  className="bg-slate-500 h-full"
                  style={{
                    width: `${(project.costByStatus.todo / project.taskCost) * 100}%`,
                  }}
                  title={`To Do: $${project.costByStatus.todo}`}
                />
              )}
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Done ${project.costByStatus.completed}
              </span>
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Active ${project.costByStatus.inProgress}
              </span>
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                Pending ${project.costByStatus.todo}
              </span>
            </div>
          </div>
        )}

        {/* Projected Total */}
        {project.burnRate > 0 && project.budget > 0 && (
          <div className={cn(
            "p-2.5 rounded-lg mb-4 flex items-center gap-2",
            project.projectedTotal > project.budget
              ? "bg-red-400/5 border border-red-400/10"
              : "bg-emerald-400/5 border border-emerald-400/10"
          )}>
            <Calendar className={cn(
              "w-4 h-4 shrink-0",
              project.projectedTotal > project.budget ? "text-red-400" : "text-emerald-400"
            )} />
            <div className="text-xs">
              <span className="text-slate-400">Projected total: </span>
              <span className={cn(
                "font-medium",
                project.projectedTotal > project.budget ? "text-red-400" : "text-emerald-400"
              )}>
                ${project.projectedTotal.toFixed(0).toLocaleString()}
              </span>
              {project.daysRemaining > 0 && (
                <span className="text-slate-500"> · {project.daysRemaining} days left</span>
              )}
            </div>
          </div>
        )}

        {/* Top Cost Tasks */}
        {project.topCostTasks.length > 0 && (
          <div>
            <p className="text-xs text-slate-500 mb-2">Top Cost Tasks</p>
            <div className="space-y-1.5">
              {project.topCostTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between py-1.5 px-2 rounded bg-slate-800/30"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", statusPriorityColors[task.status] ? "bg-current" : "")} 
                      style={{ color: task.status === "completed" ? "#34d399" : task.status === "in_progress" ? "#fbbf24" : "#94a3b8" }}
                    />
                    <span className="text-xs text-slate-300 truncate">
                      {task.title}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-cyan-400 shrink-0 ml-2">
                    ${task.cost}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress Footer */}
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-800">
          <Progress value={project.progress} className="h-1.5 bg-slate-800 flex-1" />
          <span className="text-xs text-slate-400">
            {project.completedTasks}/{project.totalTasks} tasks
          </span>
        </div>
      </CardContent>
    </Card>
  )
}