"use client";

import { useState } from "react";
import {
  whatIfSavings,
  type HealthScore,
  type Forecast,
  type MonthComparison,
  type SavingsSuggestion,
  type TxLike,
} from "../lib/insights";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";

function vnd(value: number): string {
  return `${value.toLocaleString("vi-VN")} đ`;
}

function changeBadge(change: number | null, goodWhenDown: boolean) {
  if (change === null) return <span className="text-xs text-slate-400">tháng trước chưa có số liệu</span>;
  const good = goodWhenDown ? change <= 0 : change >= 0;
  const sign = change > 0 ? "+" : "";
  return (
    <span className={`text-sm font-semibold ${good ? "text-cyan-300" : "text-fuchsia-400"}`}>
      {sign}{change}%
    </span>
  );
}

function streakBadge(streak: number): string {
  if (streak >= 30) return "🔥 Huyền thoại";
  if (streak >= 14) return "🔥 Cháy quá";
  if (streak >= 7) return "🔥 Đang cháy";
  if (streak >= 3) return "✨ Khởi động tốt";
  return "Bắt đầu thôi";
}

export default function InsightsPanel({
  health,
  forecast,
  comparison,
  top,
  streak,
  suggestion,
}: {
  health: HealthScore;
  forecast: Forecast;
  comparison: MonthComparison;
  top: TxLike[];
  streak: number;
  suggestion: SavingsSuggestion;
}) {
  const [cut, setCut] = useState(200000);
  const whatIf = whatIfSavings(cut);

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-100">💡 Thông minh</h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="rounded-3xl border-cyan-500/20 bg-slate-900/80 shadow-[0_0_25px_rgba(34,211,238,0.08)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-100">❤️ Điểm sức khỏe tài chính</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-bold text-cyan-300">{health.score}</span>
              <span className="pb-1 text-sm text-slate-400">/ 100 — {health.label}</span>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
                style={{ width: `${health.score}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-slate-400">
              Tỉ lệ tiết kiệm tháng này: {health.savingsRate}% · Streak ghi chép: {health.streak} ngày
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-cyan-500/20 bg-slate-900/80 shadow-[0_0_25px_rgba(34,211,238,0.08)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-100">🔮 Dự báo cuối tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">{vnd(forecast.projectedBalance)}</p>
            <p className="mt-1 text-sm text-slate-400">
              Chi trung bình {vnd(forecast.dailyExpenseRate)}/ngày · còn {forecast.daysRemaining} ngày
            </p>
            {forecast.willBeNegative ? (
              <p className="mt-2 text-sm font-semibold text-fuchsia-400">
                ⚠️ Cứ chi thế này thì cuối tháng sẽ âm tiền!
              </p>
            ) : (
              <p className="mt-2 text-sm text-cyan-300">✅ Tốc độ chi hiện tại vẫn an toàn.</p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-fuchsia-500/20 bg-slate-900/80 shadow-[0_0_25px_rgba(232,121,249,0.08)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-100">🧪 Nếu cắt chi thì sao?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="cut" className="text-slate-200">Cắt mỗi tháng (VND)</Label>
              <Input
                id="cut"
                type="number"
                min={0}
                step={10000}
                value={cut}
                onChange={(e) => setCut(Number(e.target.value) || 0)}
                className="rounded-xl border-slate-700 bg-slate-950/70 text-white placeholder:text-slate-500 focus-visible:ring-cyan-400"
              />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-slate-800/80 p-2">
                <p className="text-xs text-slate-400">3 tháng</p>
                <p className="font-semibold text-cyan-300">{vnd(whatIf.m3)}</p>
              </div>
              <div className="rounded-xl bg-slate-800/80 p-2">
                <p className="text-xs text-slate-400">6 tháng</p>
                <p className="font-semibold text-cyan-300">{vnd(whatIf.m6)}</p>
              </div>
              <div className="rounded-xl bg-slate-800/80 p-2">
                <p className="text-xs text-slate-400">12 tháng</p>
                <p className="font-semibold text-cyan-300">{vnd(whatIf.m12)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-cyan-500/20 bg-slate-900/80 shadow-[0_0_25px_rgba(34,211,238,0.08)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-100">📈 So với tháng trước</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-200">Thu nhập ({vnd(comparison.income.current)})</span>
              {changeBadge(comparison.income.change, false)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-200">Chi tiêu ({vnd(comparison.expense.current)})</span>
              {changeBadge(comparison.expense.change, true)}
            </div>
            <p className="pt-1 text-sm text-slate-400">
              Tháng trước: thu {vnd(comparison.income.previous)} · chi {vnd(comparison.expense.previous)}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-fuchsia-500/20 bg-slate-900/80 shadow-[0_0_25px_rgba(232,121,249,0.08)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-100">🏆 Top 5 khoản chi lớn nhất tháng</CardTitle>
          </CardHeader>
          <CardContent>
            {top.length === 0 ? (
              <p className="py-4 text-center text-sm text-slate-400">Tháng này chưa có khoản chi nào.</p>
            ) : (
              <ul className="space-y-2">
                {top.map((t, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex-1 truncate text-slate-100">
                      {i + 1}. {t.description ?? t.category.replaceAll("_", " ")}
                    </span>
                    <span className="shrink-0 font-semibold text-fuchsia-400">{vnd(t.amount)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-cyan-500/20 bg-slate-900/80 shadow-[0_0_25px_rgba(34,211,238,0.08)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-100">🔥 Streak ghi chép</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold text-cyan-300">{streak}</span>
              <div>
                <p className="text-sm text-slate-200">ngày liên tiếp ghi giao dịch</p>
                <Badge variant="secondary" className="mt-1 rounded-full bg-slate-800 text-cyan-300 hover:bg-slate-800">
                  {streakBadge(streak)}
                </Badge>
              </div>
            </div>
            {suggestion ? (
              <p className="mt-3 text-sm text-slate-300">
                💡 Tháng này chi nhiều nhất cho <b>{suggestion.category.replaceAll("_", " ")}</b> ({vnd(suggestion.amount)}). 
                Thử cắt 10% (~{vnd(suggestion.suggestedCut)}) là đã tiết kiệm được kha khá.
              </p>
            ) : (
              <p className="mt-3 text-sm text-slate-400">Chưa có dữ liệu chi tiêu tháng này để gợi ý.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
