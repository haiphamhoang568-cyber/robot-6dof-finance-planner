"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { CategoryTotal } from "../lib/charts";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

const COLORS = [
  "#22d3ee",
  "#e879f9",
  "#a78bfa",
  "#fbbf24",
  "#34d399",
  "#fb7185",
  "#94a3b8",
  "#f97316",
];

export default function CategoryChart({ data }: { data: CategoryTotal[] }) {
  return (
    <Card className="rounded-3xl border-fuchsia-500/20 bg-slate-900/80 shadow-[0_0_25px_rgba(232,121,249,0.08)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-slate-100">🍕 Chi theo danh mục</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">Chưa có khoản chi nào.</p>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ category, percent }: { category?: string; percent?: number }) =>
                    `${(category ?? "").replaceAll("_", " ")} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {data.map((entry, i) => (
                    <Cell key={entry.category} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number | undefined) =>
                    typeof v === "number" ? `${v.toLocaleString("vi-VN")} đ` : v
                  }
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #164e63", borderRadius: 12 }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Legend wrapperStyle={{ color: "#e2e8f0" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
