// src/app/(dashboard)/activity/page.tsx
"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  Pencil,
  Trash2,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Loader2,
  Activity,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"

interface ActivityItem {
  id: string
  action: string
  entityType: string
  entityId: string
  details: string | null
  createdAt: string
  user: { name: string; email: string }
  project: { id: string; name: string; color: string } | null
}

interface ActivityData {
  activities: ActivityItem[]
  grouped: Record<string, ActivityItem[]>
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const actionConfig: Record<string, { icon: typeof Plus; label: string; color: string; bg: string }> = {
  created: { icon: Plus, label: "Created", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  updated: { icon: Pencil, label: "Updated", color: "text-blue-400", bg: "bg-blue-400/10" },
  deleted: { icon: Trash2, label: "Deleted", color: "text-red-400", bg: "bg-red-400/10" },
  moved: { icon: ArrowRight, label: "Moved", color: "text-amber-400", bg: "bg-amber-400/10" },
  restored: { icon: RotateCcw, label: "Restored", color: "text-indigo-400", bg: "bg-indigo-400/10" },
  completed: { icon: CheckCircle2, label: "Completed", color: "text-emerald-400", bg: "bg-emerald-400/10" },
}

export default function ActivityPage() {
  const [data, setData] = useState<ActivityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [actionFilter, setActionFilter] = useState("all")
  const [entityFilter, setEntityFilter] = useState("all")

  const fetchActivity = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "30",
      })
      if (actionFilter !== "all") params.set("action", actionFilter)
      if (entityFilter !== "all") params.set("entityType", entityFilter)

      const res = await fetch(`/api/activity?${params}`)
      if (!res.ok) throw new Error("Failed to fetch")
      const result = await res.json()
      setData(result)
    } catch (error) {
      console.error("Activity fetch error:", error)
    } finally {
      setLoading(false)
    }
  }, [page, actionFilter, entityFilter])

  useEffect(() => {
    fetchActivity()
  }, [fetchActivity])

  useEffect(() => {
    setPage(1)
  }, [actionFilter, entityFilter])

  const renderActivity = (activity: ActivityItem) => {
    const config = actionConfig[activity.action] || actionConfig.updated
    const ActionIcon = config.icon

    let details: Record<string, string> = {}
    try {
      details = activity.details ? JSON.parse(activity.details) : {}
    } catch { /* ignore */ }

    const entityName = details.taskTitle || details.projectName || activity.entityType

    let description = ""
    if (activity.action === "moved" && details.from && details.to) {
      const labels: Record<string, string> = {
        todo: "To Do",
        in_progress: "In Progress",
        completed: "Completed",
      }
      description = `Moved from ${labels[details.from] || details.from} → ${labels[details.to] || details.to}`
    } else {
      description = `${config.label} ${activity.entityType}`
    }

    return (
      <div
        key={activity.id}
        className="flex items-start gap-4 py-3 px-4 rounded-lg hover:bg-slate-800/30 transition-colors"
      >
        <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${config.bg}`}>
          <ActionIcon className={`w-4 h-4 ${config.color}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm">
                <span className="font-medium text-white">{entityName}</span>
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            </div>
            <span className="text-xs text-slate-600 shrink-0 mt-0.5">
              {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
            </span>
          </div>

          {activity.project && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: activity.project.color }}
              />
              <span className="text-[11px] text-slate-500">
                {activity.project.name}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Activity Log</h1>
          <p className="text-slate-400 mt-1">
            {data ? `${data.pagination.total} total events` : "Loading..."}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-slate-400">
          <Filter className="w-4 h-4" />
          <span className="text-sm">Filter:</span>
        </div>

        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-[150px] bg-slate-900/50 border-slate-800 text-white">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="created">Created</SelectItem>
            <SelectItem value="updated">Updated</SelectItem>
            <SelectItem value="deleted">Deleted</SelectItem>
            <SelectItem value="moved">Moved</SelectItem>
            <SelectItem value="restored">Restored</SelectItem>
          </SelectContent>
        </Select>

        <Select value={entityFilter} onValueChange={setEntityFilter}>
          <SelectTrigger className="w-[150px] bg-slate-900/50 border-slate-800 text-white">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="project">Projects</SelectItem>
            <SelectItem value="task">Tasks</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        </div>
      )}

      {/* Empty State */}
      {!loading && data && data.activities.length === 0 && (
        <Card className="bg-slate-900/50 border-slate-800 border-dashed">
          <CardContent className="p-12 text-center">
            <Activity className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="font-semibold text-lg">No activity found</h3>
            <p className="text-slate-400 mt-1">
              {actionFilter !== "all" || entityFilter !== "all"
                ? "Try adjusting your filters"
                : "Activity will appear here as you use the app"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Activity List Grouped by Date */}
      {!loading && data && Object.keys(data.grouped).length > 0 && (
        <div className="space-y-6">
          {Object.entries(data.grouped).map(([date, activities]) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-sm font-semibold text-slate-400">{date}</h3>
                <div className="flex-1 h-px bg-slate-800" />
                <span className="text-xs text-slate-600">{activities.length} events</span>
              </div>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-2">
                  <div className="divide-y divide-slate-800/50">
                    {activities.map(renderActivity)}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && data && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-slate-500">
            Page {data.pagination.page} of {data.pagination.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
              disabled={page >= data.pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}