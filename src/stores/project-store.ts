// src/stores/project-store.ts
import { create } from "zustand"

export interface ProjectWithStats {
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
  clientEmail: string | null
  color: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  userId: string
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  progress: number
  health: "on_track" | "at_risk" | "behind"
}

interface ProjectStore {
  projects: ProjectWithStats[]
  loading: boolean
  error: string | null
  activeProjectId: string | null

  setProjects: (projects: ProjectWithStats[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setActiveProject: (id: string | null) => void
  addProject: (project: ProjectWithStats) => void
  updateProject: (id: string, data: Partial<ProjectWithStats>) => void
  removeProject: (id: string) => void

  fetchProjects: () => Promise<void>
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  loading: false,
  error: null,
  activeProjectId: null,

  setProjects: (projects) => set({ projects }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setActiveProject: (id) => set({ activeProjectId: id }),

  addProject: (project) =>
    set((state) => ({
      projects: [project, ...state.projects],
    })),

  updateProject: (id, data) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...data } : p
      ),
    })),

  removeProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    })),

  fetchProjects: async () => {
    set({ loading: true, error: null })
    try {
      const res = await fetch("/api/projects")
      if (!res.ok) throw new Error("Failed to fetch projects")
      const data = await res.json()
      set({ projects: data, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },
}))