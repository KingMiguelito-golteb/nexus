// src/components/skeletons.tsx
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded bg-slate-800/80",
        className
      )}
    />
  )
}

export function StatCardSkeleton() {
  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Shimmer className="h-4 w-24" />
            <Shimmer className="h-7 w-16" />
            <Shimmer className="h-3 w-32" />
          </div>
          <Shimmer className="h-11 w-11 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  )
}

export function ProjectCardSkeleton() {
  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Shimmer className="h-3 w-3 rounded-full" />
          <Shimmer className="h-5 w-16 rounded-full" />
          <Shimmer className="h-5 w-14 rounded-full" />
        </div>
        <Shimmer className="h-6 w-3/4" />
        <Shimmer className="h-4 w-1/2" />
        <div className="space-y-2 pt-2">
          <div className="flex justify-between">
            <Shimmer className="h-3 w-16" />
            <Shimmer className="h-3 w-8" />
          </div>
          <Shimmer className="h-2 w-full rounded-full" />
        </div>
        <div className="flex gap-4 pt-2">
          <Shimmer className="h-3 w-16" />
          <Shimmer className="h-3 w-16" />
        </div>
      </CardContent>
    </Card>
  )
}

export function ChartSkeleton() {
  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardContent className="p-6">
        <Shimmer className="h-5 w-40 mb-6" />
        <div className="flex items-end gap-2 h-[200px]">
          {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
            <Shimmer
              key={i}
              className="flex-1 rounded-t"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function KanbanSkeleton() {
  return (
    <div className="flex gap-4 h-full">
      {[1, 2, 3].map((col) => (
        <div key={col} className="flex-1 min-w-[300px] max-w-[400px]">
          <div className="flex items-center gap-2 mb-3 px-1">
            <Shimmer className="h-4 w-4 rounded-full" />
            <Shimmer className="h-4 w-20" />
            <Shimmer className="h-5 w-6 rounded-full" />
          </div>
          <div className="space-y-2 p-2 rounded-xl border border-slate-800/50 bg-slate-900/30">
            {Array.from({ length: col === 1 ? 3 : col === 2 ? 2 : 1 }).map(
              (_, i) => (
                <div
                  key={i}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <Shimmer className="h-4 w-4" />
                    <Shimmer className="h-4 w-3/4" />
                  </div>
                  <Shimmer className="h-3 w-full ml-6" />
                  <div className="flex items-center gap-2 ml-6 pt-1">
                    <Shimmer className="h-4 w-14 rounded-full" />
                    <Shimmer className="h-3 w-12" />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export function ActivitySkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2].map((group) => (
        <div key={group}>
          <div className="flex items-center gap-3 mb-2">
            <Shimmer className="h-4 w-32" />
            <div className="flex-1 h-px bg-slate-800" />
          </div>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-2">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-start gap-4 py-3 px-4">
                  <Shimmer className="h-8 w-8 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Shimmer className="h-4 w-3/4" />
                    <Shimmer className="h-3 w-1/2" />
                  </div>
                  <Shimmer className="h-3 w-16 shrink-0" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}

export function FinanceSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-5 space-y-3">
          <Shimmer className="h-5 w-48" />
          <Shimmer className="h-3 w-full rounded-full" />
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  )
}