"use client";

import { useState } from "react";
import RecurringForm, { type RecurringFormData } from "./recurring-form";
import { deleteRecurring } from "../lib/actions/recurring";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";
import { robotCategoryLabel } from "../lib/robot-labels";

export default function RecurringRow({ item }: { item: RecurringFormData }) {
  const [editing, setEditing] = useState(false);
  const isIncome = item.type === "INCOME";
  const amountColor = isIncome ? "text-emerald-300" : "text-amber-200";

  return (
    <li className="robot-entry">
      <div className="robot-entry-line">
        <div className="robot-entry-details">
          <strong>{item.description}</strong>
          <div className="robot-entry-meta">
            <span>Ngày {item.dayOfMonth} hằng tháng</span>
            <Badge variant="secondary" className="bg-sky-950 text-cyan-200">{robotCategoryLabel(item.category)}</Badge>
          </div>
        </div>
        <div className="robot-entry-actions">
          <span className={"robot-entry-amount " + amountColor}>
            {isIncome ? "+" : "−"}{item.amount.toLocaleString("vi-VN")} ₫
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-expanded={editing}
            onClick={() => setEditing((v) => !v)}
            className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-200"
          >
            {editing ? "Đóng" : "Sửa"}
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => {
              if (confirm(`Xóa khoản định kỳ "${item.description}"?`)) {
                void deleteRecurring(item.id).then(() => toast.success("Đã xóa khoản định kỳ."));
              }
            }}
          >
            Xóa
          </Button>
        </div>
      </div>
      {editing && (
        <div className="mt-3">
          <RecurringForm item={item} />
        </div>
      )}
    </li>
  );
}
