// src/components/command-palette.tsx
"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  LayoutDashboard,
  FolderKanban,
  DollarSign,
  Activity,
  Settings,
  Plus,
  Search,
} from "lucide-react"
import { useProjectStore } from "@/stores/project-store"
import { cn } from "@/lib/utils"

interface CommandItem {
  id: string
  label: string
  icon: React.ReactNode
  action: () => void
  group: string
  keywords?: string
  right?: React.ReactNode
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const { projects, fetchProjects } = useProjectStore()

  // Listen for Ctrl+K / Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Fetch projects when opened
  useEffect(() => {
    if (open) {
      setQuery("")
      setSelectedIndex(0)
      if (projects.length === 0) fetchProjects()
      // Focus input after dialog animation
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open, projects.length, fetchProjects])

  const runCommand = useCallback(
    (action: () => void) => {
      setOpen(false)
      action()
    },
    []
  )

  // Build items list
  const items: CommandItem[] = [
    // Navigation
    {
      id: "nav-dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
      action: () => router.push("/dashboard"),
      group: "Navigation",
      keywords: "home overview stats",
    },
    {
      id: "nav-projects",
      label: "Projects",
      icon: <FolderKanban className="w-4 h-4" />,
      action: () => router.push("/projects"),
      group: "Navigation",
      keywords: "boards kanban",
    },
    {
      id: "nav-finances",
      label: "Finances",
      icon: <DollarSign className="w-4 h-4" />,
      action: () => router.push("/finances"),
      group: "Navigation",
      keywords: "budget money cost spending",
    },
    {
      id: "nav-activity",
      label: "Activity Log",
      icon: <Activity className="w-4 h-4" />,
      action: () => router.push("/activity"),
      group: "Navigation",
      keywords: "history events log",
    },
    {
      id: "nav-settings",
      label: "Settings & Trash",
      icon: <Settings className="w-4 h-4" />,
      action: () => router.push("/settings"),
      group: "Navigation",
      keywords: "trash deleted restore preferences",
    },
    // Actions
    {
      id: "action-new-project",
      label: "Create New Project",
      icon: <Plus className="w-4 h-4" />,
      action: () => router.push("/projects/new"),
      group: "Actions",
      keywords: "add new create project",
    },
    // Projects
    ...projects.map((project) => ({
      id: `project-${project.id}`,
      label: project.name,
      icon: (
        <div
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: project.color }}
        />
      ),
      action: () => router.push(`/projects/${project.id}`),
      group: "Projects",
      keywords: project.clientName || "",
      right: (
        <span className="text-xs text-slate-500">{project.progress}%</span>
      ),
    })),
  ]

  // Filter
  const filtered = query
    ? items.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.keywords?.toLowerCase().includes(query.toLowerCase()) ||
          item.group.toLowerCase().includes(query.toLowerCase())
      )
    : items

  // Group filtered items
  const groups: Record<string, CommandItem[]> = {}
  filtered.forEach((item) => {
    if (!groups[item.group]) groups[item.group] = []
    groups[item.group].push(item)
  })

  const flatFiltered = filtered
  const maxIndex = flatFiltered.length - 1

  // Keyboard navigation
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, maxIndex))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === "Enter") {
        e.preventDefault()
        const item = flatFiltered[selectedIndex]
        if (item) runCommand(item.action)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, selectedIndex, maxIndex, flatFiltered, runCommand])

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-slate-900 border-slate-800 p-0 gap-0 max-w-[500px] top-[20%] translate-y-0">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
          />
          <kbd className="text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[320px] overflow-y-auto py-2">
          {filtered.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-slate-500">
              No results found.
            </div>
          )}

          {Object.entries(groups).map(([groupName, groupItems]) => (
            <div key={groupName}>
              <div className="px-4 py-1.5">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  {groupName}
                </p>
              </div>
              {groupItems.map((item) => {
                const globalIndex = flatFiltered.findIndex(
                  (f) => f.id === item.id
                )
                const isSelected = globalIndex === selectedIndex

                return (
                  <button
                    key={item.id}
                    onClick={() => runCommand(item.action)}
                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                      isSelected
                        ? "bg-slate-800 text-white"
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                    )}
                  >
                    <div className="shrink-0">{item.icon}</div>
                    <span className="flex-1 text-left truncate">
                      {item.label}
                    </span>
                    {item.right && <div className="shrink-0">{item.right}</div>}
                    {isSelected && (
                      <kbd className="text-[10px] font-mono text-slate-600 ml-1">
                        ↵
                      </kbd>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-slate-800 text-[10px] text-slate-600">
          <span className="flex items-center gap-1">
            <kbd className="font-mono bg-slate-800 px-1 py-0.5 rounded">↑↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="font-mono bg-slate-800 px-1 py-0.5 rounded">↵</kbd>
            select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="font-mono bg-slate-800 px-1 py-0.5 rounded">esc</kbd>
            close
          </span>
        </div>
      </DialogContent>
    </Dialog>
  )
}