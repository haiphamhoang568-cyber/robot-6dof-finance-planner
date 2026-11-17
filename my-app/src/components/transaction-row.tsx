"use client";

import { useState } from "react";
import TransactionForm, { type TransactionFormData } from "./transaction-form";
import DeleteButton from "./delete-button";

export default function TransactionRow({ tx }: { tx: TransactionFormData }) {
  const [editing, setEditing] = useState(false);

  return (
    <li className="flex flex-col gap-2 rounded border p-3">
      <div className="flex items-center justify-between gap-2">
        <span>
          {new Date(tx.date).toLocaleDateString("vi-VN")} — {tx.description} —{" "}
          {tx.type === "INCOME" ? "+" : "-"}
          {tx.amount.toLocaleString("vi-VN")}đ ({tx.category.replaceAll("_", " ")})
        </span>
        <span className="flex gap-2">
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            className="rounded border px-2 py-1 text-sm"
          >
            {editing ? "Đóng" : "Sửa"}
          </button>
          <DeleteButton id={tx.id} />
        </span>
      </div>
      {editing && <TransactionForm transaction={tx} />}
    </li>
  );
}
