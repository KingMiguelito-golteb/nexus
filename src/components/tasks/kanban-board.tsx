// src/components/tasks/kanban-board.tsx
"use client"

import { useState, useMemo, useCallback } from "react"
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
} from "@dnd-kit/core"
import { KanbanColumn } from "./kanban-column"
import { TaskDialog } from "./task-dialog"
import { useTaskStore, TaskData } from "@/stores/task-store"
import { toast } from "sonner"
import { Circle, Timer, CheckCircle2, GripVertical } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface KanbanBoardProps {
  projectId: string
}

const columns = [
  {
    id: "todo",
    title: "To Do",
    icon: <Circle className="w-4 h-4 text-slate-400" />,
    color: "bg-slate-400/10 text-slate-400",
  },
  {
    id: "in_progress",
    title: "In Progress",
    icon: <Timer className="w-4 h-4 text-amber-400" />,
    color: "bg-amber-400/10 text-amber-400",
  },
  {
    id: "completed",
    title: "Completed",
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    color: "bg-emerald-400/10 text-emerald-400",
  },
]

const COLUMN_IDS = ["todo", "in_progress", "completed"]

const priorityConfig: Record<string, { label: string; class: string }> = {
  low: { label: "Low", class: "bg-slate-400/10 text-slate-400 border-slate-400/20" },
  medium: { label: "Medium", class: "bg-blue-400/10 text-blue-400 border-blue-400/20" },
  high: { label: "High", class: "bg-orange-400/10 text-orange-400 border-orange-400/20" },
  critical: { label: "Critical", class: "bg-red-400/10 text-red-400 border-red-400/20" },
}

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const { tasks, setTasks, removeTask, fetchTasks } = useTaskStore()

  const [activeTask, setActiveTask] = useState<TaskData | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<TaskData | null>(null)
  const [defaultStatus, setDefaultStatus] = useState("todo")

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  const tasksByStatus = useMemo(() => {
    const grouped: Record<string, TaskData[]> = {
      todo: [],
      in_progress: [],
      completed: [],
    }

    tasks.forEach((task) => {
      if (grouped[task.status]) {
        grouped[task.status].push(task)
      }
    })

    Object.keys(grouped).forEach((status) => {
      grouped[status].sort((a, b) => a.position - b.position)
    })

    return grouped
  }, [tasks])

  const handleAddTask = useCallback((status: string) => {
    setEditingTask(null)
    setDefaultStatus(status)
    setDialogOpen(true)
  }, [])

  const handleEditTask = useCallback((task: TaskData) => {
    setEditingTask(task)
    setDialogOpen(true)
  }, [])

  const handleDeleteTask = useCallback(async (task: TaskData) => {
    try {
      const res = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete task")

      removeTask(task.id)

      toast("Task deleted", {
        description: task.title,
        action: {
          label: "Undo",
          onClick: async () => {
            await fetch(`/api/tasks/${task.id}/restore`, { method: "POST" })
            fetchTasks(projectId)
            toast.success("Task restored!")
          },
        },
        duration: 5000,
      })
    } catch {
      toast.error("Failed to delete task")
    }
  }, [removeTask, fetchTasks, projectId])

  const getColumnForId = useCallback((id: string): string | null => {
    if (COLUMN_IDS.includes(id)) return id
    const task = tasks.find((t) => t.id === id)
    return task?.status || null
  }, [tasks])

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id)
    if (task) setActiveTask(task)
  }, [tasks])

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeColumn = getColumnForId(active.id as string)
    const overColumn = getColumnForId(over.id as string)

    if (!activeColumn || !overColumn || activeColumn === overColumn) return

    setTasks(
      tasks.map((t) =>
        t.id === active.id ? { ...t, status: overColumn } : t
      )
    )
  }, [tasks, setTasks, getColumnForId])

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    setActiveTask(null)

    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string
    if (activeId === overId) return

    const activeTaskData = tasks.find((t) => t.id === activeId)
    if (!activeTaskData) return

    let targetStatus: string
    if (COLUMN_IDS.includes(overId)) {
      targetStatus = overId
    } else {
      const overTask = tasks.find((t) => t.id === overId)
      targetStatus = overTask?.status || activeTaskData.status
    }

    const columnTasks = tasks
      .filter((t) => t.status === targetStatus && t.id !== activeId)
      .sort((a, b) => a.position - b.position)

    let targetPosition: number
    if (COLUMN_IDS.includes(overId)) {
      targetPosition = columnTasks.length
    } else {
      const overIndex = columnTasks.findIndex((t) => t.id === overId)
      targetPosition = overIndex >= 0 ? overIndex : columnTasks.length
    }

    const newTasks = tasks.map((t) => {
      if (t.id === activeId) {
        return { ...t, status: targetStatus, position: targetPosition }
      }
      if (t.status === targetStatus && t.id !== activeId) {
        const idx = columnTasks.findIndex((ct) => ct.id === t.id)
        return { ...t, position: idx >= targetPosition ? idx + 1 : idx }
      }
      return t
    })

    setTasks(newTasks)

    try {
      const res = await fetch(`/api/tasks/${activeId}/move`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus, position: targetPosition }),
      })
      if (!res.ok) throw new Error("Move failed")
    } catch {
      fetchTasks(projectId)
      toast.error("Failed to move task")
    }
  }, [tasks, setTasks, fetchTasks, projectId])

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        measuring={{
          droppable: { strategy: MeasuringStrategy.Always },
        }}
      >
        <div className="flex gap-4 h-full overflow-x-auto pb-4 kanban-column">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              icon={column.icon}
              tasks={tasksByStatus[column.id] || []}
              color={column.color}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>

        {/* Drag Overlay — simplified floating card */}
        <DragOverlay dropAnimation={null}>
          {activeTask ? (
            <div className="bg-slate-800 border border-indigo-500/50 rounded-lg p-3 shadow-2xl shadow-indigo-500/10 w-[320px] rotate-2 select-none">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-indigo-400 shrink-0" />
                <h4 className="text-sm font-medium text-white truncate">
                  {activeTask.title}
                </h4>
              </div>
              {activeTask.description && (
                <p className="text-xs text-slate-400 mt-1.5 ml-6 line-clamp-1">
                  {activeTask.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2 ml-6">
                <Badge
                  variant="outline"
                  className={`text-[10px] px-1.5 py-0 ${
                    (priorityConfig[activeTask.priority] || priorityConfig.medium).class
                  }`}
                >
                  {(priorityConfig[activeTask.priority] || priorityConfig.medium).label}
                </Badge>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        projectId={projectId}
        task={editingTask}
        defaultStatus={defaultStatus}
      />
    </>
  )
}