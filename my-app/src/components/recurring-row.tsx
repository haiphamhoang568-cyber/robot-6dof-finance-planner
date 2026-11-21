"use client";

import { useState } from "react";
import RecurringForm, { type RecurringFormData } from "./recurring-form";
import { deleteRecurring } from "../lib/actions/recurring";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";

export default function RecurringRow({ item }: { item: RecurringFormData }) {
  const [editing, setEditing] = useState(false);
  const isIncome = item.type === "INCOME";
  return (
    <li className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-lg font-bold text-cyan-300">🔁</span>
        <span className="w-16 shrink-0 text-sm text-slate-400">Ngày {item.dayOfMonth}</span>
        <span className="flex-1 font-medium text-slate-100">{item.description}</span>
        <Badge variant="secondary" className="rounded-full bg-slate-800 text-cyan-300 hover:bg-slate-800">
          {item.category.replaceAll("_", " ")}
        </Badge>
        <span className={`w-32 shrink-0 text-right font-semibold ${isIncome ? "text-cyan-300" : "text-fuchsia-400"}`}>
          {isIncome ? "+" : "−"}{item.amount.toLocaleString("vi-VN")} đ
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setEditing((v) => !v)}
          className="rounded-full border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-200"
        >
          {editing ? "Đóng" : "Sửa"}
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => {
            if (confirm(`Xóa hóa đơn định kỳ "${item.description}"?`)) {
              void deleteRecurring(item.id).then(() => toast.success("Đã xóa hóa đơn định kỳ."));
            }
          }}
        >
          Xóa
        </Button>
      </div>
      {editing && (
        <div className="mt-3">
          <RecurringForm item={item} />
        </div>
      )}
    </li>
  );
}
