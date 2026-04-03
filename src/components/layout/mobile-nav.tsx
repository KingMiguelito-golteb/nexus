// src/components/layout/mobile-nav.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { useProjectStore } from "@/stores/project-store"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Menu,
  LayoutDashboard,
  FolderKanban,
  Plus,
  Settings,
  LogOut,
  Zap,
  DollarSign,
  Activity,
  X,
  Search,
} from "lucide-react"

interface MobileNavProps {
  user: {
    id?: string
    name?: string | null
    email?: string | null
  }
  onOpenSearch: () => void
}

const mainNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Finances", href: "/finances", icon: DollarSign },
  { label: "Activity", href: "/activity", icon: Activity },
  { label: "Settings", href: "/settings", icon: Settings },
]

export function MobileNav({ user, onOpenSearch }: MobileNavProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { projects } = useProjectStore()

  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"

  const activeProjects = projects.filter((p) => p.status === "active").slice(0, 5)

  return (
    <div className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl shrink-0">
      <div className="flex items-center gap-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] bg-slate-900 border-slate-800 p-0">
            {/* Logo */}
            <div className="flex items-center justify-between px-4 h-14">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold">Nexus</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white"
                onClick={() => setOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <Separator className="bg-slate-800" />

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {mainNav.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                        isActive
                          ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/20"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                      )}
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                )
              })}

              <Separator className="bg-slate-800 my-4" />

              <Link href="/projects/new" onClick={() => setOpen(false)}>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50">
                  <Plus className="w-5 h-5" />
                  <span>New Project</span>
                </div>
              </Link>

              {activeProjects.length > 0 && (
                <>
                  <Separator className="bg-slate-800 my-4" />
                  <div className="px-3 mb-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Active Projects
                    </p>
                  </div>
                  {activeProjects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      onClick={() => setOpen(false)}
                    >
                      <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800/50">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: project.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="truncate">{project.name}</p>
                          <Progress value={project.progress} className="h-1 bg-slate-800 mt-1" />
                        </div>
                        <span className="text-xs text-slate-500">{project.progress}%</span>
                      </div>
                    </Link>
                  ))}
                </>
              )}
            </nav>

            {/* User */}
            <div className="p-3 border-t border-slate-800">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-800/30">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-indigo-600 text-white text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-white"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" />
          </div>
          <span className="font-bold text-sm">Nexus</span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="text-slate-400 hover:text-white"
        onClick={onOpenSearch}
      >
        <Search className="w-5 h-5" />
      </Button>
    </div>
  )
}