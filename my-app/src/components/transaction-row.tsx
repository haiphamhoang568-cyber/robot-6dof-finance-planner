"use client";

import { useState } from "react";
import TransactionForm, {
  type TransactionFormData,
} from "./transaction-form";
import DeleteButton from "./delete-button";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { robotCategoryLabel } from "../lib/robot-labels";

export default function TransactionRow({ tx }: { tx: TransactionFormData }) {
  const [editing, setEditing] = useState(false);
  const isIncome = tx.type === "INCOME";
  const amountColor = isIncome ? "text-emerald-300" : "text-amber-200";

  return (
    <li className="robot-entry">
      <div className="robot-entry-line">
        <div className="robot-entry-details">
          <strong>{tx.description}</strong>
          <div className="robot-entry-meta">
            <span>{new Date(tx.date).toLocaleDateString("vi-VN")}</span>
            <Badge variant="secondary" className="bg-sky-950 text-cyan-200">{robotCategoryLabel(tx.category)}</Badge>
          </div>
        </div>
        <div className="robot-entry-actions">
          <span className={"robot-entry-amount " + amountColor}>
            {isIncome ? "+" : "−"}{tx.amount.toLocaleString("vi-VN")} ₫
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
          <DeleteButton id={tx.id} />
        </div>
      </div>
      {editing && (
        <div className="mt-3">
          <TransactionForm transaction={tx} />
        </div>
      )}
    </li>
  );
}
