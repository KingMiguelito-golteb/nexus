// src/app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SplashScreen } from "@/components/splash-screen"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nexus — Project Management",
  description:
    "Lightweight, Real-Time Distributed Task Management and Project Lifecycle System",
  keywords: [
    "project management",
    "kanban",
    "task management",
    "dashboard",
    "analytics",
  ],
  authors: [{ name: "King Miguel T. Remo" }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        <SplashScreen>{children}</SplashScreen>
      </body>
    </html>
  )
}