// src/hooks/use-auto-refresh.ts
"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useProjectStore } from "@/stores/project-store"

export function useAutoRefresh() {
  const pathname = usePathname()
  const { fetchProjects } = useProjectStore()

  useEffect(() => {
    // Refresh project list on every navigation
    fetchProjects()
  }, [pathname, fetchProjects])
}