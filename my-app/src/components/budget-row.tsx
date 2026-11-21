"use client";

import { deleteBudget } from "../lib/actions/budgets";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

export type BudgetRowData = {
  id: string;
  category: string;
  limit: number;
};

export default function BudgetRow({
  budget,
  spent,
}: {
  budget: BudgetRowData;
  spent: number;
}) {
  const pct = budget.limit > 0 ? Math.round((spent / budget.limit) * 100) : 0;
  const barPct = Math.min(100, Math.max(0, pct));
  const barColor =
    pct >= 100
      ? "bg-gradient-to-r from-rose-500 to-fuchsia-500"
      : pct >= 80
        ? "bg-gradient-to-r from-amber-400 to-fuchsia-500"
        : "bg-gradient-to-r from-cyan-400 to-fuchsia-500";
  return (
    <li className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex-1 font-medium text-slate-100">
          {budget.category.replaceAll("_", " ")}
        </span>
        <span className="text-sm text-slate-400">
          {spent.toLocaleString("vi-VN")} / {budget.limit.toLocaleString("vi-VN")} đ
        </span>
        <span className={`w-14 shrink-0 text-right text-sm font-semibold ${pct >= 100 ? "text-rose-400" : pct >= 80 ? "text-amber-300" : "text-cyan-300"}`}>
          {pct}%
        </span>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => {
            if (confirm(`Xóa ngân sách ${budget.category.replaceAll("_", " ")}?`)) {
              void deleteBudget(budget.id).then(() => toast.success("Đã xóa ngân sách."));
            }
          }}
        >
          Xóa
        </Button>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-800">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${barPct}%` }} />
      </div>
      {pct >= 100 ? (
        <p className="mt-1 text-right text-xs font-semibold text-rose-400">⚠️ Vượt ngân sách!</p>
      ) : pct >= 80 ? (
        <p className="mt-1 text-right text-xs text-amber-300">Sắp hết ngân sách, chi tiêu cẩn thận nhé.</p>
      ) : null}
    </li>
  );
}
