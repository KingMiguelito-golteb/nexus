// src/components/dashboard/activity-feed.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Plus,
  Pencil,
  Trash2,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ActivityItem {
  id: string
  action: string
  entityType: string
  entityId: string
  details: string | null
  createdAt: string
  user: { name: string }
  project: { name: string; color: string } | null
}

interface ActivityFeedProps {
  data: ActivityItem[]
}

const actionConfig: Record<string, { icon: typeof Plus; color: string }> = {
  created: { icon: Plus, color: "text-emerald-400 bg-emerald-400/10" },
  updated: { icon: Pencil, color: "text-blue-400 bg-blue-400/10" },
  deleted: { icon: Trash2, color: "text-red-400 bg-red-400/10" },
  moved: { icon: ArrowRight, color: "text-amber-400 bg-amber-400/10" },
  restored: { icon: RotateCcw, color: "text-indigo-400 bg-indigo-400/10" },
  completed: { icon: CheckCircle2, color: "text-emerald-400 bg-emerald-400/10" },
}

export function ActivityFeed({ data }: ActivityFeedProps) {
  if (data.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-slate-500 text-sm">
            No activity yet
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2">
          {data.map((activity) => {
            const config = actionConfig[activity.action] || actionConfig.updated
            const ActionIcon = config.icon
            let details: Record<string, string> = {}
            try {
              details = activity.details ? JSON.parse(activity.details) : {}
            } catch { /* ignore */ }

            const entityName =
              details.taskTitle || details.projectName || activity.entityType

            let description = `${activity.action} ${activity.entityType}`
            if (activity.action === "moved" && details.from && details.to) {
              const statusLabels: Record<string, string> = {
                todo: "To Do",
                in_progress: "In Progress",
                completed: "Completed",
              }
              description = `moved from ${statusLabels[details.from] || details.from} to ${statusLabels[details.to] || details.to}`
            }

            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 py-2.5 border-b border-slate-800/50 last:border-0"
              >
                <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${config.color}`}>
                  <ActionIcon className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300">
                    <span className="font-medium text-white">{entityName}</span>
                    {" "}
                    <span className="text-slate-500">{description}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {activity.project && (
                      <div className="flex items-center gap-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: activity.project.color }}
                        />
                        <span className="text-[10px] text-slate-500">
                          {activity.project.name}
                        </span>
                      </div>
                    )}
                    <span className="text-[10px] text-slate-600">
                      {formatDistanceToNow(new Date(activity.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}