// src/components/splash-screen.tsx
"use client"

import { useState, useEffect } from "react"
import { Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Check if splash was already shown this session
    const shown = sessionStorage.getItem("nexus-splash-shown")
    if (shown) {
      setShow(false)
      return
    }

    // Start fade out after 1.5s
    const fadeTimer = setTimeout(() => setFadeOut(true), 1500)
    // Remove splash after 2s
    const removeTimer = setTimeout(() => {
      setShow(false)
      sessionStorage.setItem("nexus-splash-shown", "true")
    }, 2000)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  if (!show) return <>{children}</>

  return (
    <>
      {/* Splash overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center transition-opacity duration-500",
          fadeOut ? "opacity-0" : "opacity-100"
        )}
      >
        <div className="text-center">
          {/* Animated Logo */}
          <div className="relative">
            {/* Pulse ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-2xl bg-indigo-600/20 animate-ping" />
            </div>

            {/* Logo */}
            <div className="relative w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
              <Zap className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Text */}
          <h1 className="mt-8 text-2xl font-bold tracking-tight animate-pulse">
            Nexus
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Loading your workspace...
          </p>

          {/* Loading bar */}
          <div className="mt-6 w-48 h-1 bg-slate-800 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full animate-loading-bar" />
          </div>
        </div>
      </div>

      {/* Content underneath (hidden by splash) */}
      {children}
    </>
  )
}