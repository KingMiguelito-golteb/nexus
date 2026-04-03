// src/app/(dashboard)/settings/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Trash2,
  RotateCcw,
  AlertTriangle,
  FolderKanban,
  ListTodo,
  Loader2,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

interface DeletedProject {
  id: string
  name: string
  color: string
  status: string
  clientName: string | null
  deletedAt: string
  _count: { tasks: number }
}

interface DeletedTask {
  id: string
  title: string
  status: string
  priority: string
  cost: number
  deletedAt: string
  project: { id: string; name: string; color: string }
}

interface TrashData {
  projects: DeletedProject[]
  tasks: DeletedTask[]
  totalItems: number
}

export default function SettingsPage() {
  const [trash, setTrash] = useState<TrashData | null>(null)
  const [loading, setLoading] = useState(true)
  const [emptyingTrash, setEmptyingTrash] = useState(false)

  const fetchTrash = async () => {
    try {
      const res = await fetch("/api/trash")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setTrash(data)
    } catch (error) {
      console.error("Trash fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrash()
  }, [])

  const handleRestoreProject = async (project: DeletedProject) => {
    try {
      const res = await fetch(`/api/projects/${project.id}/restore`, {
        method: "POST",
      })
      if (!res.ok) throw new Error("Failed to restore")
      toast.success(`"${project.name}" restored!`)
      fetchTrash()
    } catch {
      toast.error("Failed to restore project")
    }
  }

  const handleRestoreTask = async (task: DeletedTask) => {
    try {
      const res = await fetch(`/api/tasks/${task.id}/restore`, {
        method: "POST",
      })
      if (!res.ok) throw new Error("Failed to restore")
      toast.success(`"${task.title}" restored!`)
      fetchTrash()
    } catch {
      toast.error("Failed to restore task")
    }
  }

  const handleEmptyTrash = async () => {
    if (!confirm("This will permanently delete all items in trash. This cannot be undone.")) {
      return
    }

    setEmptyingTrash(true)
    try {
      const res = await fetch("/api/trash", { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to empty trash")
      toast.success("Trash emptied!")
      fetchTrash()
    } catch {
      toast.error("Failed to empty trash")
    } finally {
      setEmptyingTrash(false)
    }
  }

  const priorityColors: Record<string, string> = {
    low: "bg-slate-400/10 text-slate-400 border-slate-400/20",
    medium: "bg-blue-400/10 text-blue-400 border-blue-400/20",
    high: "bg-orange-400/10 text-orange-400 border-orange-400/20",
    critical: "bg-red-400/10 text-red-400 border-red-400/20",
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 overflow-y-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your workspace and recover deleted items.</p>
      </div>

      {/* Trash Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-400/10">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Trash</h2>
              <p className="text-sm text-slate-400">
                {trash ? `${trash.totalItems} items in trash` : "Loading..."}
              </p>
            </div>
          </div>

          {trash && trash.totalItems > 0 && (
            <Button
              variant="ghost"
              className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
              onClick={handleEmptyTrash}
              disabled={emptyingTrash}
            >
              {emptyingTrash ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Empty Trash
            </Button>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          </div>
        )}

        {!loading && trash && trash.totalItems === 0 && (
          <Card className="bg-slate-900/50 border-slate-800 border-dashed">
            <CardContent className="p-12 text-center">
              <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="font-semibold text-lg">Trash is empty</h3>
              <p className="text-slate-400 mt-1">Deleted items will appear here for recovery</p>
            </CardContent>
          </Card>
        )}

        {/* Deleted Projects */}
        {!loading && trash && trash.projects.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
              <FolderKanban className="w-4 h-4" />
              Deleted Projects ({trash.projects.length})
            </h3>
            <div className="space-y-2">
              {trash.projects.map((project) => (
                <Card key={project.id} className="bg-slate-900/50 border-slate-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full shrink-0 opacity-50"
                          style={{ backgroundColor: project.color }}
                        />
                        <div>
                          <h4 className="font-medium text-slate-300">{project.name}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            {project.clientName && (
                              <span className="text-xs text-slate-500">{project.clientName}</span>
                            )}
                            <span className="text-xs text-slate-600">
                              {project._count.tasks} tasks
                            </span>
                            <span className="text-xs text-slate-600">·</span>
                            <span className="text-xs text-slate-600">
                              Deleted {formatDistanceToNow(new Date(project.deletedAt), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-400/10"
                        onClick={() => handleRestoreProject(project)}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Restore
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Deleted Tasks */}
        {!loading && trash && trash.tasks.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
              <ListTodo className="w-4 h-4" />
              Deleted Tasks ({trash.tasks.length})
            </h3>
            <div className="space-y-2">
              {trash.tasks.map((task) => (
                <Card key={task.id} className="bg-slate-900/50 border-slate-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: task.project.color }}
                        />
                        <div>
                          <h4 className="font-medium text-slate-300">{task.title}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-500">{task.project.name}</span>
                            <Badge
                              variant="outline"
                              className={`text-[10px] px-1.5 py-0 ${priorityColors[task.priority] || ""}`}
                            >
                              {task.priority}
                            </Badge>
                            {task.cost > 0 && (
                              <span className="text-xs text-slate-500">${task.cost}</span>
                            )}
                            <span className="text-xs text-slate-600">
                              Deleted {formatDistanceToNow(new Date(task.deletedAt), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-400/10"
                        onClick={() => handleRestoreTask(task)}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Restore
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {trash && trash.totalItems > 0 && (
          <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-amber-400/5 border border-amber-400/10">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="text-xs text-slate-400">
              Items in trash can be restored at any time. Use &quot;Empty Trash&quot; to permanently delete all items.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}