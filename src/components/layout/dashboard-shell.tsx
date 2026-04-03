// src/components/layout/dashboard-shell.tsx
"use client"

import { useState, useCallback } from "react"
import { Sidebar } from "./sidebar"
import { MobileNav } from "./mobile-nav"
import { CommandPalette } from "@/components/command-palette"
import { AutoRefreshProvider } from "@/components/providers/auto-refresh-provider"

interface DashboardShellProps {
  user: {
    id?: string
    name?: string | null
    email?: string | null
  }
  children: React.ReactNode
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const handleOpenSearch = useCallback(() => {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      bubbles: true,
    })
    document.dispatchEvent(event)
  }, [])

  return (
    <AutoRefreshProvider>
      <div className="h-screen flex flex-col lg:flex-row bg-slate-950 text-white overflow-hidden">
        <MobileNav user={user} onOpenSearch={handleOpenSearch} />
        <div className="hidden lg:block">
          <Sidebar user={user} />
        </div>
        <main className="flex-1 overflow-auto">{children}</main>
        <CommandPalette />
      </div>
    </AutoRefreshProvider>
  )
}