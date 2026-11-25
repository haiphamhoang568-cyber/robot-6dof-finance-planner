"use client";

import { ChartNoAxesColumn } from "lucide-react";
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

const compactAmount = new Intl.NumberFormat("vi-VN", { notation: "compact", maximumFractionDigits: 1 });

export default function MonthlyChart({ data }: { data: MonthlyTotal[] }) {
  const hasMovement = data.some((month) => month.income !== 0 || month.expense !== 0);

  return (
    <Card className="robot-surface">
      <CardHeader>
        <CardTitle className="robot-panel-title">
          <ChartNoAxesColumn size={18} aria-hidden="true" /> Dòng tiền theo tháng
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasMovement ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 4" stroke="#263b48" vertical={false} />
                <XAxis dataKey="month" stroke="#adc0ce" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#adc0ce"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={52}
                  tickFormatter={(value: number) => compactAmount.format(value)}
                />
                <Tooltip
                  formatter={(value) => typeof value === "number" ? value.toLocaleString("vi-VN") + " ₫" : value}
                  contentStyle={{ backgroundColor: "#102332", border: "1px solid #355465", borderRadius: 10 }}
                  labelStyle={{ color: "#e7f7fb" }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="income" name="Thu vào quỹ" fill="#78e4ef" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Chi dự án" fill="#ffc27e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="robot-chart-empty">
            <ChartNoAxesColumn size={33} aria-hidden="true" />
            <p>Ghi giao dịch đầu tiên để xem dòng tiền theo tháng.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
