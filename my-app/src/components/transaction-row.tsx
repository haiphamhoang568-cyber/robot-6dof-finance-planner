"use client";

import { useState } from "react";
import TransactionForm, {
  type TransactionFormData,
} from "./transaction-form";
import DeleteButton from "./delete-button";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

export default function TransactionRow({ tx }: { tx: TransactionFormData }) {
  const [editing, setEditing] = useState(false);
  const isIncome = tx.type === "INCOME";
  return (
    <li className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
            isIncome ? "bg-cyan-500/15 text-cyan-300" : "bg-fuchsia-500/15 text-fuchsia-300"
          }`}
        >
          {isIncome ? "+" : "−"}
        </span>
        <span className="w-24 shrink-0 text-sm text-slate-400">
          {new Date(tx.date).toLocaleDateString("vi-VN")}
        </span>
        <span className="flex-1 font-medium text-slate-100">{tx.description}</span>
        <Badge variant="secondary" className="rounded-full bg-slate-800 text-cyan-300 hover:bg-slate-800">{tx.category.replaceAll("_", " ")}</Badge>
        <span
          className={`w-32 shrink-0 text-right font-semibold ${
            isIncome ? "text-cyan-300" : "text-fuchsia-400"
          }`}
        >
          {isIncome ? "+" : "−"}
          {tx.amount.toLocaleString("vi-VN")} đ
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
        <DeleteButton id={tx.id} />
      </div>
      {editing && (
        <div className="mt-3">
          <TransactionForm transaction={tx} />
        </div>
      )}
    </li>
  );
}
