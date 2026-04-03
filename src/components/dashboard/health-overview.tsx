// src/components/dashboard/health-overview.tsx
"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Heart, AlertTriangle, XCircle, Calendar } from "lucide-react"
import { format } from "date-fns"

interface HealthProject {
  id: string
  name: string
  color: string
  progress: number
  health: "on_track" | "at_risk" | "behind"
  totalTasks: number
  completedTasks: number
  endDate: string | null
}

interface HealthOverviewProps {
  data: HealthProject[]
}

const healthConfig = {
  on_track: { icon: Heart, label: "On Track", class: "text-emerald-400", bg: "bg-emerald-400/10" },
  at_risk: { icon: AlertTriangle, label: "At Risk", class: "text-amber-400", bg: "bg-amber-400/10" },
  behind: { icon: XCircle, label: "Behind", class: "text-red-400", bg: "bg-red-400/10" },
}

export function HealthOverview({ data }: HealthOverviewProps) {
  if (data.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-base">Project Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-slate-500 text-sm">
            No active projects
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle className="text-base">Project Health</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((project) => {
          const health = healthConfig[project.health]
          const HealthIcon = health.icon

          return (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-800/50 transition-colors group">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: project.color }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-white truncate group-hover:text-indigo-400 transition-colors">
                      {project.name}
                    </h4>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${health.bg} ${health.class}`}>
                        <HealthIcon className="w-3 h-3" />
                        {health.label}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Progress value={project.progress} className="h-1.5 bg-slate-800 flex-1" />
                    <span className="text-xs text-slate-400 shrink-0">
                      {project.completedTasks}/{project.totalTasks}
                    </span>
                  </div>

                  {project.endDate && (
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500">
                      <Calendar className="w-3 h-3" />
                      Due {format(new Date(project.endDate), "MMM d, yyyy")}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}