"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { KanbanBoard } from "@/components/tasks/kanban-board"
import { useTaskStore } from "@/stores/task-store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
  ListTodo,
  CheckCircle2,
  Timer,
  DollarSign,
  Calendar,
} from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

interface ProjectDetail {
  id: string
  name: string
  description: string | null
  status: string
  priority: string
  budget: number
  spent: number
  startDate: string
  endDate: string | null
  clientName: string | null
  color: string
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  todoTasks: number
  progress: number
  totalCost: number
}

const statusConfig: Record<string, { label: string; class: string }> = {
  active: { label: "Active", class: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" },
  completed: { label: "Completed", class: "bg-blue-400/10 text-blue-400 border-blue-400/20" },
  on_hold: { label: "On Hold", class: "bg-amber-400/10 text-amber-400 border-amber-400/20" },
  archived: { label: "Archived", class: "bg-slate-400/10 text-slate-400 border-slate-400/20" },
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const { fetchTasks, tasks } = useTaskStore()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}`)
        if (!res.ok) throw new Error("Failed to fetch project")
        const data = await res.json()
        setProject(data)
        await fetchTasks(projectId)
      } catch {
        toast.error("Project not found")
        router.push("/projects")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [projectId, fetchTasks, router])

  // Recompute stats from local task state
  const liveStats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    progress:
      tasks.length > 0
        ? Math.round(
            (tasks.filter((t) => t.status === "completed").length /
              tasks.length) *
              100
          )
        : 0,
    totalCost: tasks.reduce((acc, t) => acc + t.cost, 0),
  }

  const handleDelete = async () => {
    if (!project) return

    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete")

      toast("Project deleted", {
        description: project.name,
        action: {
          label: "Undo",
          onClick: async () => {
            await fetch(`/api/projects/${project.id}/restore`, {
              method: "POST",
            })
            toast.success("Project restored!")
          },
        },
        duration: 5000,
      })

      router.push("/projects")
    } catch {
      toast.error("Failed to delete project")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    )
  }

  if (!project) return null

  const status = statusConfig[project.status] || statusConfig.active

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 border-b border-slate-800 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Link href="/projects">
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white mt-1"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>

            <div>
              <div className="flex items-center gap-3 mb-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                <h1 className="text-2xl font-bold">{project.name}</h1>
                <Badge variant="outline" className={status.class}>
                  {status.label}
                </Badge>
              </div>

              {project.clientName && (
                <p className="text-slate-400 text-sm ml-6">
                  {project.clientName}
                </p>
              )}

              {project.description && (
                <p className="text-slate-500 text-sm mt-1 ml-6 max-w-2xl">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white"
              >
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-slate-800 border-slate-700"
            >
              <DropdownMenuItem
                onClick={() => router.push(`/projects/${project.id}/edit`)}
                className="text-slate-300 focus:text-white focus:bg-slate-700"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit Project
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-400 focus:text-red-300 focus:bg-red-400/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-6 mt-4 ml-10">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-slate-400">
              <ListTodo className="w-4 h-4" />
              <span>{liveStats.total} tasks</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <Timer className="w-4 h-4 text-amber-400" />
              <span>{liveStats.inProgress} in progress</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{liveStats.completed} done</span>
            </div>
            {project.budget > 0 && (
              <div className="flex items-center gap-1.5 text-slate-500">
                <DollarSign className="w-4 h-4 text-cyan-400" />
                <span>
                  ${liveStats.totalCost.toLocaleString()} / $
                  {project.budget.toLocaleString()}
                </span>
              </div>
            )}
            {project.endDate && (
              <div className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(project.endDate), "MMM d, yyyy")}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 flex-1 max-w-xs">
            <Progress value={liveStats.progress} className="h-2 bg-slate-800 flex-1" />
            <span className="text-sm font-medium text-indigo-400">
              {liveStats.progress}%
            </span>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 p-6 overflow-hidden">
        <KanbanBoard projectId={projectId} />
      </div>
    </div>
  )
}