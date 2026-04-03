// src/components/dashboard/budget-chart.tsx
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

interface BudgetChartProps {
  data: {
    name: string
    fullName: string
    budget: number
    spent: number
    remaining: number
    color: string
  }[]
}

export function BudgetChart({ data }: BudgetChartProps) {
  if (data.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-base">Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[280px] text-slate-500 text-sm">
            No budget data
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle className="text-base">Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ left: 10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="name"
              stroke="#475569"
              fontSize={11}
              tick={{ fill: "#94a3b8" }}
              angle={-20}
              textAnchor="end"
              height={60}
            />
            <YAxis
              stroke="#475569"
              fontSize={12}
              tick={{ fill: "#94a3b8" }}
              tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#f1f5f9",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
              labelFormatter={(label) => {
                const item = data.find((d) => d.name === label)
                return item?.fullName || label
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }} />
            <Bar dataKey="spent" name="Spent" fill="#f87171" radius={[0, 0, 0, 0]} stackId="budget" />
            <Bar dataKey="remaining" name="Remaining" fill="#34d399" radius={[4, 4, 0, 0]} stackId="budget" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}