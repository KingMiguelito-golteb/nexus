// src/components/dashboard/project-progress-chart.tsx
"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProjectProgressChartProps {
  data: {
    name: string
    fullName: string
    todo: number
    inProgress: number
    completed: number
    progress: number
    color: string
  }[]
}

export function ProjectProgressChart({ data }: ProjectProgressChartProps) {
  if (data.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-base">Project Task Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[280px] text-slate-500 text-sm">
            No projects yet
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle className="text-base">Project Task Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
            <XAxis type="number" stroke="#475569" fontSize={12} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#475569"
              fontSize={12}
              width={100}
              tick={{ fill: "#94a3b8" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#f1f5f9",
                fontSize: "12px",
              }}
              labelFormatter={(label) => {
                const item = data.find((d) => d.name === label)
                return item?.fullName || label
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }}
            />
            <Bar dataKey="completed" name="Completed" fill="#34d399" stackId="tasks" radius={[0, 0, 0, 0]} />
            <Bar dataKey="inProgress" name="In Progress" fill="#fbbf24" stackId="tasks" />
            <Bar dataKey="todo" name="To Do" fill="#94a3b8" stackId="tasks" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}