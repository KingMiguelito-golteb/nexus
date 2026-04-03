"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { useProjectStore } from "@/stores/project-store"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  LayoutDashboard,
  FolderKanban,
  Plus,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
  DollarSign,
  Activity,
  Trash2,
  Search, 
} from "lucide-react"

interface SidebarProps {
  user: {
    id?: string
    name?: string | null
    email?: string | null
  }
}

const mainNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Finances", href: "/finances", icon: DollarSign },
  { label: "Activity", href: "/activity", icon: Activity },
]

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [trashCount, setTrashCount] = useState(0)
  const { projects, fetchProjects } = useProjectStore()

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  useEffect(() => {
    const fetchTrashCount = async () => {
      try {
        const res = await fetch("/api/trash")
        if (res.ok) {
          const data = await res.json()
          setTrashCount(data.totalItems || 0)
        }
      } catch { /* ignore */ }
    }
    fetchTrashCount()

    // Refresh trash count every 30 seconds
    const interval = setInterval(fetchTrashCount, 30000)
    return () => clearInterval(interval)
  }, [])

  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"

  const recentProjects = projects
    .filter((p) => p.status === "active")
    .slice(0, 5)

  return (
    <div
      className={cn(
        "h-screen flex flex-col border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 shrink-0">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight">Nexus</span>
        )}
      </div>

      <Separator className="bg-slate-800" />

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {mainNav.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </div>
            </Link>
          )
        })}

        <Separator className="bg-slate-800 my-4" />

        {!collapsed && (
          <div className="px-3 mb-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Quick Actions
            </p>
          </div>
        )}

        <Link href="/projects/new">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all">
            <Plus className="w-5 h-5 shrink-0" />
            {!collapsed && <span>New Project</span>}
          </div>
        </Link>

        {/* Active Projects */}
        {!collapsed && recentProjects.length > 0 && (
          <>
            <Separator className="bg-slate-800 my-4" />
            <div className="px-3 mb-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active Projects
              </p>
            </div>
            <div className="space-y-1">
              {recentProjects.map((project) => {
                const isActive = pathname === `/projects/${project.id}`
                return (
                  <Link key={project.id} href={`/projects/${project.id}`}>
                    <div
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                        isActive
                          ? "bg-slate-800 text-white"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                      )}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: project.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm">{project.name}</p>
                        <div className="mt-1">
                          <Progress value={project.progress} className="h-1 bg-slate-800" />
                        </div>
                      </div>
                      <span className="text-xs text-slate-500 shrink-0">
                        {project.progress}%
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}

        {collapsed && recentProjects.length > 0 && (
          <>
            <Separator className="bg-slate-800 my-4" />
            <div className="space-y-1">
              {recentProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <div className="flex items-center justify-center py-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: project.color }}
                      title={project.name}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </nav>

          {/* Bottom Section */}
      <div className="p-3 space-y-2">
        <Separator className="bg-slate-800" />

        {/* Search Shortcut */}
        {!collapsed && (
          <button
            onClick={() => {
              const event = new KeyboardEvent("keydown", {
                key: "k",
                metaKey: true,
                bubbles: true,
              })
              document.dispatchEvent(event)
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-all"
          >
            <Search className="w-4 h-4" />
            <span className="flex-1 text-left">Search...</span>
            <kbd className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
              ⌘K
            </kbd>
          </button>
        )}

        <Link href="/settings">
          <div className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
            pathname === "/settings"
              ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/20"
              : "text-slate-400 hover:text-white hover:bg-slate-800/50"
          )}>
            <Settings className="w-5 h-5 shrink-0" />
            {!collapsed && (
              <div className="flex items-center justify-between flex-1">
                <span>Settings</span>
                {trashCount > 0 && (
                  <span className="flex items-center gap-1 text-xs text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded-full">
                    <Trash2 className="w-3 h-3" />
                    {trashCount}
                  </span>
                )}
              </div>
            )}
          </div>
        </Link>

        {/* User Profile */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-800/30">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-indigo-600 text-white text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          )}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-white shrink-0"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-slate-500 hover:text-white"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}