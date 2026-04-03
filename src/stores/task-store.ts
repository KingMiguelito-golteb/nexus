import { create } from "zustand"

export interface TaskData {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  position: number
  dueDate: string | null
  estimatedHours: number | null
  actualHours: number | null
  cost: number
  tags: string | null
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  projectId: string
  assigneeId: string | null
  assignee: {
    id: string
    name: string
    email: string
  } | null
}

interface TaskStore {
  tasks: TaskData[]
  loading: boolean
  error: string | null

  setTasks: (tasks: TaskData[]) => void
  setLoading: (loading: boolean) => void
  addTask: (task: TaskData) => void
  updateTask: (id: string, data: Partial<TaskData>) => void
  removeTask: (id: string) => void
  moveTask: (taskId: string, newStatus: string, newPosition: number) => void

  fetchTasks: (projectId: string) => Promise<void>
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  loading: false,
  error: null,

  setTasks: (tasks) => set({ tasks }),
  setLoading: (loading) => set({ loading }),

  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),

  updateTask: (id, data) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
    })),

  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),

  moveTask: (taskId, newStatus, newPosition) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? { ...t, status: newStatus, position: newPosition }
          : t
      ),
    })),

  fetchTasks: async (projectId: string) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`/api/projects/${projectId}/tasks`)
      if (!res.ok) throw new Error("Failed to fetch tasks")
      const data = await res.json()
      set({ tasks: data, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },
}))