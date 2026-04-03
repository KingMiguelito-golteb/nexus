// src/components/providers/auto-refresh-provider.tsx
"use client"

import { useAutoRefresh } from "@/hooks/use-auto-refresh"

export function AutoRefreshProvider({ children }: { children: React.ReactNode }) {
  useAutoRefresh()
  return <>{children}</>
}