// src/components/landing/landing-page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Zap,
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  FolderKanban,
  DollarSign,
  Activity,
  Shield,
  Sparkles,
  GripVertical,
  BarChart3,
  Clock,
  Users,
  Star,
  Github,
  Heart,
  Code2,
  Layers,
  MousePointerClick,
  Trash2,
  Search,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: FolderKanban,
    title: "Kanban Board",
    description:
      "Drag-and-drop task management with visual columns. Move tasks between To Do, In Progress, and Completed effortlessly.",
    color: "text-indigo-400",
    bg: "bg-indigo-400/10",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Real-time charts and insights. Track task distribution, project health, weekly activity, and priority breakdowns.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    icon: DollarSign,
    title: "Financial Tracking",
    description:
      "Budget monitoring with burn rate calculations, spending trends, and projected totals for every project.",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
  },
  {
    icon: Activity,
    title: "Activity Log",
    description:
      "Complete audit trail of every action. Filter by type, search through history, and never lose track of changes.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  {
    icon: Trash2,
    title: "Soft Delete & Undo",
    description:
      "Accidentally deleted something? No problem. Restore any project or task from the trash, or undo within 5 seconds.",
    color: "text-rose-400",
    bg: "bg-rose-400/10",
  },
  {
    icon: Search,
    title: "Command Palette",
    description:
      "Press Ctrl+K to instantly search projects, navigate pages, or trigger actions. Keyboard-first workflow.",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
  },
]

const stats = [
  { label: "API Routes", value: "14+" },
  { label: "Components", value: "30+" },
  { label: "Charts", value: "7" },
  { label: "Features", value: "20+" },
]

const techStack = [
  "Next.js 14",
  "TypeScript",
  "Tailwind CSS",
  "Prisma",
  "PostgreSQL",
  "NextAuth",
  "Zustand",
  "Recharts",
  "@dnd-kit",
  "shadcn/ui",
]

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-slate-950/80 backdrop-blur-xl border-b border-slate-800"
            : "bg-transparent"
        )}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">Nexus</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">
                Features
              </a>
              <a href="#tech" className="text-sm text-slate-400 hover:text-white transition-colors">
                Tech Stack
              </a>
              <Link href="/about" className="text-sm text-slate-400 hover:text-white transition-colors">
                About
              </Link>
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" className="text-slate-300 hover:text-white">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-slate-400 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-4 space-y-3">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-400 py-2">
              Features
            </a>
            <a href="#tech" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-400 py-2">
              Tech Stack
            </a>
            <Link href="/about" className="block text-sm text-slate-400 py-2">
              About
            </Link>
            <div className="flex gap-3 pt-2">
              <Link href="/login" className="flex-1">
                <Button variant="ghost" className="w-full text-slate-300">Sign In</Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Get Started</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center max-w-3xl mx-auto">
            <Badge
              variant="outline"
              className="mb-6 bg-indigo-400/5 text-indigo-400 border-indigo-400/20 px-4 py-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Personal Project — Built from a Rejected Proposal
            </Badge>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Project Management,{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Nexus is a lightweight, real-time task management and project lifecycle system
              built for small-to-medium teams. Kanban boards, financial tracking, and
              analytics — all in one beautiful dashboard.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-12 text-base"
                >
                  Start Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-slate-300 hover:text-white h-12 text-base"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-lg mx-auto">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden shadow-2xl shadow-indigo-500/5">
              {/* Fake browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/80">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-slate-800/50 rounded-md px-4 py-1 text-xs text-slate-500">
                    nexus.app/dashboard
                  </div>
                </div>
              </div>
              {/* Fake dashboard content */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  {["#6366f1", "#34d399", "#fbbf24", "#06b6d4"].map((color, i) => (
                    <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
                      <div className="w-8 h-8 rounded-lg mb-3 opacity-20" style={{ backgroundColor: color }} />
                      <div className="h-3 w-12 bg-slate-700/50 rounded" />
                      <div className="h-5 w-8 bg-slate-700/30 rounded mt-2" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((col) => (
                    <div key={col} className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/20">
                      <div className="h-3 w-16 bg-slate-700/50 rounded mb-3" />
                      {Array.from({ length: 4 - col }).map((_, i) => (
                        <div key={i} className="bg-slate-800/50 rounded p-2.5 mb-2 border border-slate-700/20">
                          <div className="h-2.5 w-3/4 bg-slate-700/40 rounded" />
                          <div className="h-2 w-1/2 bg-slate-700/20 rounded mt-1.5" />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 bg-emerald-400/5 text-emerald-400 border-emerald-400/20">
              Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Everything you need to manage projects
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
              Built with modern web technologies for a fast, intuitive experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300"
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", feature.bg)}>
                  <feature.icon className={cn("w-6 h-6", feature.color)} />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-indigo-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 bg-amber-400/5 text-amber-400 border-amber-400/20">
              How It Works
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">Simple, powerful workflow</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create a Project",
                description: "Set up your project with details, budget, timeline, and choose a color. Add client information for easy tracking.",
                icon: Layers,
              },
              {
                step: "02",
                title: "Manage Tasks",
                description: "Add tasks to your Kanban board. Drag and drop between columns, set priorities, due dates, and track costs.",
                icon: MousePointerClick,
              },
              {
                step: "03",
                title: "Track & Analyze",
                description: "Monitor progress with real-time analytics. View financial health, team activity, and project status at a glance.",
                icon: BarChart3,
              },
            ].map((item) => (
              <div key={item.step} className="relative p-6 rounded-xl bg-slate-900/30 border border-slate-800">
                <span className="text-5xl font-black text-slate-800/50 absolute top-4 right-4">
                  {item.step}
                </span>
                <div className="w-10 h-10 rounded-lg bg-indigo-400/10 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section id="tech" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 bg-violet-400/5 text-violet-400 border-violet-400/20">
              <Code2 className="w-3.5 h-3.5 mr-1.5" />
              Tech Stack
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">Built with modern technologies</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-800 text-sm text-slate-300 hover:border-indigo-500/30 hover:text-indigo-400 transition-all"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-800/50">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold">Ready to get started?</h2>
          <p className="mt-4 text-lg text-slate-400">
            Create your free account and start managing projects like a pro.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-12">
                Create Free Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold">Nexus</span>
              <span className="text-sm text-slate-500">— Project Management System</span>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/about" className="text-sm text-slate-500 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/login" className="text-sm text-slate-500 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="text-sm text-slate-500 hover:text-white transition-colors">
                Register
              </Link>
            </div>

            <p className="text-sm text-slate-600 flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-red-400" /> by King Miguel T. Remo
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}