"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  GripVertical,
  MoreHorizontal,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  DollarSign,
  User,
} from "lucide-react"
import { TaskData } from "@/stores/task-store"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const priorityConfig: Record<string, { label: string; class: string }> = {
  low: { label: "Low", class: "bg-slate-400/10 text-slate-400 border-slate-400/20" },
  medium: { label: "Medium", class: "bg-blue-400/10 text-blue-400 border-blue-400/20" },
  high: { label: "High", class: "bg-orange-400/10 text-orange-400 border-orange-400/20" },
  critical: { label: "Critical", class: "bg-red-400/10 text-red-400 border-red-400/20" },
}

interface TaskCardProps {
  task: TaskData
  onEdit: (task: TaskData) => void
  onDelete: (task: TaskData) => void
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  const priority = priorityConfig[task.priority] || priorityConfig.medium

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "completed"

  const tags = task.tags
    ? task.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : []

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-lg p-3 transition-all group select-none",
        isDragging
          ? "opacity-40 bg-slate-800/30 border-2 border-dashed border-indigo-500/50"
          : "bg-slate-800/50 border border-slate-700/50 hover:border-slate-600"
      )}
    >
      {/* Top Row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* DRAG HANDLE — this is the only draggable part */}
          <div
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            data-draggable="true"
            className="text-slate-600 hover:text-slate-300 cursor-grab active:cursor-grabbing shrink-0 p-1 -m-1 rounded hover:bg-slate-700/50 transition-colors"
          >
            <GripVertical className="w-4 h-4 pointer-events-none" />
          </div>
          <h4 className="text-sm font-medium text-white truncate">
            {task.title}
          </h4>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
            <DropdownMenuItem
              onClick={() => onEdit(task)}
              className="text-slate-300 focus:text-white focus:bg-slate-700"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem
              onClick={() => onDelete(task)}
              className="text-red-400 focus:text-red-300 focus:bg-red-400/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-400 mt-1.5 ml-6 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2 ml-6">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 text-[10px] rounded bg-slate-700/50 text-slate-400"
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="px-1.5 py-0.5 text-[10px] rounded bg-slate-700/50 text-slate-500">
              +{tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Bottom Row */}
      <div className="flex items-center justify-between mt-3 ml-6">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${priority.class}`}>
            {priority.label}
          </Badge>
          {task.dueDate && (
            <span className={`flex items-center gap-1 text-[10px] ${isOverdue ? "text-red-400" : "text-slate-500"}`}>
              <Calendar className="w-3 h-3" />
              {format(new Date(task.dueDate), "MMM d")}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {task.cost > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-slate-500">
              <DollarSign className="w-3 h-3" />{task.cost}
            </span>
          )}
          {task.estimatedHours && (
            <span className="flex items-center gap-0.5 text-[10px] text-slate-500">
              <Clock className="w-3 h-3" />{task.estimatedHours}h
            </span>
          )}
          {task.assignee && (
            <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center" title={task.assignee.name}>
              <User className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}