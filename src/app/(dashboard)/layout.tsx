// src/app/(dashboard)/layout.tsx
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { SessionProvider } from "@/components/providers/session-provider"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { Toaster } from "sonner"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <SessionProvider>
      <DashboardShell user={session.user}>
        {children}
      </DashboardShell>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1e293b",
            border: "1px solid #334155",
            color: "#f1f5f9",
          },
        }}
      />
    </SessionProvider>
  )
}