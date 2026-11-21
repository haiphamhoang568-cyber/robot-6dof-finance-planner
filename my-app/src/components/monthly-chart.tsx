"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { MonthlyTotal } from "../lib/charts";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

function vnd(value: number): string {
  return `${value.toLocaleString("vi-VN")} đ`;
}

export default function MonthlyChart({ data }: { data: MonthlyTotal[] }) {
  return (
    <Card className="rounded-3xl border-cyan-500/20 bg-slate-900/80 shadow-[0_0_25px_rgba(34,211,238,0.08)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-slate-100">📊 Thu / Chi theo tháng</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis
                stroke="#94a3b8"
                tick={{ fontSize: 12 }}
                tickFormatter={(v: number) => `${(v / 1000000).toLocaleString("vi-VN")}tr`}
              />
              <Tooltip
                formatter={(v) => (typeof v === "number" ? vnd(v) : v)}
                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #164e63", borderRadius: 12 }}
                labelStyle={{ color: "#e2e8f0" }}
              />
              <Legend wrapperStyle={{ color: "#e2e8f0" }} />
              <Bar dataKey="income" name="Thu" fill="#22d3ee" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Chi" fill="#e879f9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
