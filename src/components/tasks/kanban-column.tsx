"use client"

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { useDroppable } from "@dnd-kit/core"
import { TaskCard } from "./task-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TaskData } from "@/stores/task-store"
import { cn } from "@/lib/utils"

interface KanbanColumnProps {
  id: string
  title: string
  icon: React.ReactNode
  tasks: TaskData[]
  color: string
  onAddTask: (status: string) => void
  onEditTask: (task: TaskData) => void
  onDeleteTask: (task: TaskData) => void
}

export function KanbanColumn({
  id,
  title,
  icon,
  tasks,
  color,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: "column",
      status: id,
    },
  })

  return (
    <div className="flex flex-col min-h-0 flex-1 min-w-[300px] max-w-[400px]">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-semibold text-sm">{title}</h3>
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              color
            )}
          >
            {tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-slate-500 hover:text-white"
          onClick={() => onAddTask(id)}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Tasks Container */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 space-y-2 p-2 rounded-xl border transition-colors duration-200 min-h-[200px] overflow-y-auto",
          isOver
            ? "border-indigo-500/50 bg-indigo-500/5"
            : "border-slate-800/50 bg-slate-900/30"
        )}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && !isOver && (
          <div className="flex flex-col items-center justify-center py-8 text-slate-600">
            <p className="text-sm">No tasks</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-slate-500 hover:text-white"
              onClick={() => onAddTask(id)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add task
            </Button>
          </div>
        )}

        {tasks.length === 0 && isOver && (
          <div className="flex items-center justify-center py-8">
            <div className="w-full h-16 rounded-lg border-2 border-dashed border-indigo-500/30 bg-indigo-500/5" />
          </div>
        )}
      </div>
    </div>
  )
}