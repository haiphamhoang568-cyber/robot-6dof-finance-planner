"use client";

import { ChartPie } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { CategoryTotal } from "../lib/charts";
import { robotCategoryLabel } from "../lib/robot-labels";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

const COLORS = [
  "#78e4ef",
  "#ffc27e",
  "#8ee3b6",
  "#9aaaf5",
  "#e8a5bb",
  "#a9c683",
  "#70aee3",
  "#f3de86",
];

export default function CategoryChart({ data }: { data: CategoryTotal[] }) {
  const entries = data.map((entry, index) => ({
    ...entry,
    label: robotCategoryLabel(entry.category),
    color: COLORS[index % COLORS.length],
  }));

  return (
    <Card className="robot-surface">
      <CardHeader>
        <CardTitle className="robot-panel-title">
          <ChartPie size={18} aria-hidden="true" /> Chi phí theo hạng mục
        </CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="robot-chart-empty">
            <ChartPie size={33} aria-hidden="true" />
            <p>Chưa ghi khoản chi nào cho dự án.</p>
          </div>
        ) : (
          <>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                  <Pie
                    data={entries}
                    dataKey="total"
                    nameKey="label"
                    innerRadius="52%"
                    outerRadius="82%"
                    paddingAngle={2}
                    stroke="#0d1b28"
                    isAnimationActive={false}
                  >
                    {entries.map((entry) => <Cell key={entry.category} fill={entry.color} />)}
                  </Pie>
                  <Tooltip
                    formatter={(value) => typeof value === "number" ? value.toLocaleString("vi-VN") + " ₫" : value}
                    contentStyle={{ backgroundColor: "#102332", border: "1px solid #355465", borderRadius: 10 }}
                    itemStyle={{ color: "#e7f7fb" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="robot-chart-legend" aria-label="Hạng mục chi phí">
              {entries.map((entry) => (
                <li key={entry.category}>
                  <span style={{ background: entry.color }} aria-hidden="true" />
                  {entry.label}
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}
