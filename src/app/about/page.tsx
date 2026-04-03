// src/app/about/page.tsx
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Zap,
  ArrowLeft,
  ArrowRight,
  Github,
  Mail,
  Heart,
  Code2,
  GraduationCap,
  Lightbulb,
  Target,
  Users,
  Calendar,
  MapPin,
  Globe,
  Star,
  Rocket,
} from "lucide-react"

const timeline = [
  {
    date: "The Proposal",
    title: "Capstone Project Submitted",
    description:
      "Nexus was originally proposed as a capstone project for CAPS 301A — a lightweight, real-time distributed task management system for SME operations.",
    icon: GraduationCap,
    color: "text-indigo-400",
    bg: "bg-indigo-400/10",
  },
  {
    date: "The Rejection",
    title: "Proposal Not Accepted",
    description:
      "Despite thorough research and planning, the proposal was rejected. But that didn't stop the vision.",
    icon: Target,
    color: "text-red-400",
    bg: "bg-red-400/10",
  },
  {
    date: "The Decision",
    title: "Building It Anyway",
    description:
      "Instead of letting the idea die, I decided to build Nexus as a personal project — proving that great ideas deserve to live.",
    icon: Lightbulb,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  {
    date: "The Result",
    title: "A Full Production System",
    description:
      "Nexus is now a complete project management platform with Kanban boards, financial tracking, analytics, and more — deployed and live.",
    icon: Rocket,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
]

const techCategories = [
  {
    category: "Frontend",
    items: [
      { name: "Next.js 14", desc: "React framework with App Router" },
      { name: "TypeScript", desc: "Type-safe JavaScript" },
      { name: "Tailwind CSS v4", desc: "Utility-first styling" },
      { name: "shadcn/ui", desc: "Accessible component library" },
      { name: "Recharts", desc: "Data visualization" },
      { name: "@dnd-kit", desc: "Drag and drop toolkit" },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Next.js API Routes", desc: "Serverless API endpoints" },
      { name: "Prisma ORM", desc: "Type-safe database access" },
      { name: "PostgreSQL", desc: "Relational database (Neon)" },
      { name: "NextAuth.js v5", desc: "Authentication" },
      { name: "bcryptjs", desc: "Password hashing" },
    ],
  },
  {
    category: "Tools & Libraries",
    items: [
      { name: "Zustand", desc: "Lightweight state management" },
      { name: "Sonner", desc: "Toast notifications" },
      { name: "Lucide React", desc: "Icon library" },
      { name: "date-fns", desc: "Date utilities" },
      { name: "Vercel", desc: "Deployment platform" },
    ],
  },
]

const team = [
  {
    name: "King Miguel T. Remo",
    role: "Full-Stack Developer",
    email: "Iggytesoro28@gmail.com",
    description:
      "Lead developer of Nexus. Passionate about building tools that solve real problems for real people.",
  },
  {
    name: "Zairhyll John A. Cantilang",
    role: "Co-Researcher",
    email: "Cantilangzairhylljohn@gmail.com",
    description:
      "Co-proponent of the original Nexus proposal. Contributed to research and system design.",
  },
  {
    name: "Ian A. Salazar",
    role: "Co-Researcher",
    email: "Salazarian159@gmail.com",
    description:
      "Co-proponent of the original Nexus proposal. Contributed to research and documentation.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">Nexus</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" className="text-slate-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto relative text-center">
          <Badge variant="outline" className="mb-6 bg-indigo-400/5 text-indigo-400 border-indigo-400/20 px-4 py-1.5">
            <Heart className="w-3.5 h-3.5 mr-1.5" />
            The Story Behind Nexus
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
            Born from a{" "}
            <span className="bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
              rejected
            </span>{" "}
            proposal,{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              built
            </span>{" "}
            with passion
          </h1>

          <p className="mt-6 text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Nexus was originally proposed as a capstone project at CSTC — Sariaya Campus. When
            the proposal was rejected, we decided to build it anyway. Because great ideas deserve
            to exist, regardless of academic acceptance.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">The Journey</h2>

          <div className="space-y-0">
            {timeline.map((item, index) => (
              <div key={item.title} className="flex gap-6">
                {/* Line */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.bg}`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="w-px h-full bg-slate-800 my-2" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-12">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {item.date}
                  </span>
                  <h3 className="text-lg font-semibold mt-1">{item.title}</h3>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 bg-emerald-400/5 text-emerald-400 border-emerald-400/20">
              <Users className="w-3.5 h-3.5 mr-1.5" />
              The Team
            </Badge>
            <h2 className="text-3xl font-bold">The people behind Nexus</h2>
            <p className="text-slate-400 mt-2">
              Originally proposed by three IT students from CSTC — Sariaya Campus
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member) => (
              <Card key={member.name} className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-white">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-sm text-indigo-400 mt-1">{member.role}</p>
                  <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                    {member.description}
                  </p>
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-1.5 mt-4 text-xs text-slate-500 hover:text-indigo-400 transition-colors"
                  >
                    <Mail className="w-3 h-3" />
                    {member.email}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Detail */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 bg-violet-400/5 text-violet-400 border-violet-400/20">
              <Code2 className="w-3.5 h-3.5 mr-1.5" />
              Tech Stack
            </Badge>
            <h2 className="text-3xl font-bold">How it&apos;s built</h2>
            <p className="text-slate-400 mt-2">
              Modern technologies chosen for performance, developer experience, and scalability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {techCategories.map((category) => (
              <Card key={category.category} className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 text-indigo-400">
                    {category.category}
                  </h3>
                  <div className="space-y-3">
                    {category.items.map((item) => (
                      <div key={item.name}>
                        <p className="text-sm font-medium text-white">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Context */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/50">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-slate-900/30 border-slate-800">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-amber-400/10">
                  <GraduationCap className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Academic Context</h3>
                  <p className="text-sm text-slate-400">CAPS 301A — Capstone Project and Research 1</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                <p>
                  <strong className="text-white">Full Title:</strong> Nexus: A Lightweight, Real-Time
                  Distributed Task Management and Project Lifecycle System for Small-to-Medium
                  Enterprise (SME) Operations.
                </p>
                <p>
                  <strong className="text-white">Institution:</strong> School of Information Technology,
                  CSTC — Sariaya, Campus
                </p>
                <p>
                  <strong className="text-white">Adviser:</strong> Jorge T. Jader, MIT
                </p>
                <p>
                  <strong className="text-white">SDG Alignment:</strong> United Nations Sustainable
                  Development Goal (SDG) 8: Decent Work and Economic Growth — promoting productivity,
                  efficiency, and sustainable growth among small and medium enterprises.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold">Want to try Nexus?</h2>
          <p className="mt-4 text-slate-400">
            Create a free account and explore the full system yourself.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-12">
                Create Free Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="ghost" className="text-slate-400 hover:text-white h-12">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm text-slate-500">Nexus — Project Management System</span>
          </div>
          <p className="text-sm text-slate-600 flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-red-400" /> by King Miguel T. Remo
          </p>
        </div>
      </footer>
    </div>
  )
}