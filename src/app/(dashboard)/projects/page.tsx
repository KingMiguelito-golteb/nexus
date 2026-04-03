"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useProjectStore, ProjectWithStats } from "@/stores/project-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  FolderKanban,
  ListTodo,
  DollarSign,
  MoreHorizontal,
  Pencil,
  Trash2,
  Calendar,
  Loader2,
  ArrowUpDown,
  Heart,
  AlertTriangle,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

const statusConfig: Record<string, { label: string; class: string }> = {
  active: { label: "Active", class: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" },
  completed: { label: "Completed", class: "bg-blue-400/10 text-blue-400 border-blue-400/20" },
  on_hold: { label: "On Hold", class: "bg-amber-400/10 text-amber-400 border-amber-400/20" },
  archived: { label: "Archived", class: "bg-slate-400/10 text-slate-400 border-slate-400/20" },
}

const priorityConfig: Record<string, { label: string; class: string }> = {
  low: { label: "Low", class: "bg-slate-400/10 text-slate-400 border-slate-400/20" },
  medium: { label: "Medium", class: "bg-blue-400/10 text-blue-400 border-blue-400/20" },
  high: { label: "High", class: "bg-orange-400/10 text-orange-400 border-orange-400/20" },
  critical: { label: "Critical", class: "bg-red-400/10 text-red-400 border-red-400/20" },
}

const healthConfig: Record<string, { icon: typeof Heart; label: string; class: string }> = {
  on_track: { icon: Heart, label: "On Track", class: "text-emerald-400" },
  at_risk: { icon: AlertTriangle, label: "At Risk", class: "text-amber-400" },
  behind: { icon: XCircle, label: "Behind", class: "text-red-400" },
}

export default function ProjectsPage() {
  const router = useRouter()
  const { projects, loading, fetchProjects, removeProject } = useProjectStore()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("updated")

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleDelete = async (project: ProjectWithStats) => {
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete project")

      removeProject(project.id)

      toast("Project deleted", {
        description: project.name,
        action: {
          label: "Undo",
          onClick: async () => {
            await fetch(`/api/projects/${project.id}/restore`, {
              method: "POST",
            })
            fetchProjects()
            toast.success("Project restored!")
          },
        },
        duration: 5000,
      })
    } catch {
      toast.error("Failed to delete project")
    }
  }

  // Filter and sort
  let filtered = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  filtered = filtered.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "priority": {
        const order = { critical: 0, high: 1, medium: 2, low: 3 }
        return (order[a.priority as keyof typeof order] ?? 2) - (order[b.priority as keyof typeof order] ?? 2)
      }
      case "progress":
        return b.progress - a.progress
      case "updated":
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    }
  })

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-slate-400 mt-1">
            {projects.length} project{projects.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link href="/projects/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px] bg-slate-900/50 border-slate-800 text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[160px] bg-slate-900/50 border-slate-800 text-white">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="updated">Last Updated</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="progress">Progress</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <Card className="bg-slate-900/50 border-slate-800 border-dashed">
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-4">
              <FolderKanban className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="font-semibold text-lg">
              {search || statusFilter !== "all" ? "No matching projects" : "No projects yet"}
            </h3>
            <p className="text-slate-400 mt-1 mb-4">
              {search || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Create your first project to get started"}
            </p>
            {!search && statusFilter === "all" && (
              <Link href="/projects/new">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      {/* Projects Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => {
            const status = statusConfig[project.status] || statusConfig.active
            const priority = priorityConfig[project.priority] || priorityConfig.medium
            const health = healthConfig[project.health] || healthConfig.on_track
            const HealthIcon = health.icon

            return (
              <Card
                key={project.id}
                className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all group"
              >
                <CardContent className="p-5">
                  {/* Top Row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: project.color }}
                      />
                      <Badge variant="outline" className={status.class}>
                        {status.label}
                      </Badge>
                      <Badge variant="outline" className={priority.class}>
                        {priority.label}
                      </Badge>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-slate-800 border-slate-700"
                      >
                        <DropdownMenuItem
                          onClick={() => router.push(`/projects/${project.id}`)}
                          className="text-slate-300 focus:text-white focus:bg-slate-700"
                        >
                          <FolderKanban className="w-4 h-4 mr-2" />
                          Open Board
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/projects/${project.id}/edit`)}
                          className="text-slate-300 focus:text-white focus:bg-slate-700"
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        <DropdownMenuItem
                          onClick={() => handleDelete(project)}
                          className="text-red-400 focus:text-red-300 focus:bg-red-400/10"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Project Name */}
                  <Link href={`/projects/${project.id}`}>
                    <h3 className="font-semibold text-lg group-hover:text-indigo-400 transition-colors cursor-pointer">
                      {project.name}
                    </h3>
                  </Link>

                  {project.clientName && (
                    <p className="text-sm text-slate-500 mt-1">{project.clientName}</p>
                  )}

                  {project.description && (
                    <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  {/* Progress */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-400">Progress</span>
                      <div className="flex items-center gap-2">
                        <HealthIcon className={`w-3.5 h-3.5 ${health.class}`} />
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                    </div>
                    <Progress value={project.progress} className="h-2 bg-slate-800" />
                  </div>

                  {/* Footer Stats */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <ListTodo className="w-3.5 h-3.5" />
                        {project.totalTasks} tasks
                      </div>
                      {project.budget > 0 && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5" />
                          ${project.budget.toLocaleString()}
                        </div>
                      )}
                    </div>
                    {project.endDate && (
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(new Date(project.endDate), "MMM d")}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}