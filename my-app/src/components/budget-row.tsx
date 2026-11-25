"use client";

import { deleteBudget } from "../lib/actions/budgets";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { robotCategoryLabel } from "../lib/robot-labels";

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
  const meterColor =
    pct >= 100
      ? { bar: "bg-rose-400", text: "text-rose-300" }
      : pct >= 80
        ? { bar: "bg-amber-300", text: "text-amber-300" }
        : { bar: "bg-cyan-300", text: "text-cyan-300" };
  const category = robotCategoryLabel(budget.category);

  return (
    <li className="robot-entry">
      <div className="robot-entry-line">
        <div className="robot-entry-details">
          <strong>{category}</strong>
          <span className="robot-entry-meta">
            {spent.toLocaleString("vi-VN")} / {budget.limit.toLocaleString("vi-VN")} ₫
          </span>
        </div>
        <div className="robot-entry-actions">
          <span className={"robot-entry-amount " + meterColor.text}>{pct}%</span>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => {
              if (confirm(`Xóa ngân sách ${category}?`)) {
                void deleteBudget(budget.id).then(() => toast.success("Đã xóa ngân sách."));
              }
            }}
          >
            Xóa
          </Button>
        </div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
        <div className={"h-full rounded-full " + meterColor.bar} style={{ width: `${barPct}%` }} />
      </div>
      {pct >= 100 ? (
        <p className="mt-1 text-right text-xs font-semibold text-rose-300">Đã chạm hoặc vượt hạn mức.</p>
      ) : pct >= 80 ? (
        <p className="mt-1 text-right text-xs text-amber-300">Sắp chạm hạn mức.</p>
      ) : null}
    </li>
  );
}
