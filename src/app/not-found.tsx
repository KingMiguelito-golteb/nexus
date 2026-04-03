// src/app/not-found.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Zap, ArrowLeft, Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative text-center max-w-lg">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1 className="text-[150px] sm:text-[200px] font-black text-slate-800/30 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center animate-bounce">
              <Zap className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Page not found</h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-xs text-slate-600">
          Tip: Press{" "}
          <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-slate-400">
            Ctrl+K
          </kbd>{" "}
          to search for anything
        </p>
      </div>
    </div>
  )
}