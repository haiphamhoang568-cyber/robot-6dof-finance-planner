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
  return (
    <li className="border-b py-3">
      <div className="flex items-center gap-3">
        <span className="w-24 shrink-0 text-sm text-muted-foreground">
          {new Date(tx.date).toLocaleDateString("vi-VN")}
        </span>
        <span className="flex-1">{tx.description}</span>
        <Badge variant="secondary">{tx.category.replaceAll("_", " ")}</Badge>
        <span
          className={`w-32 text-right font-medium ${
            tx.type === "INCOME" ? "text-green-600" : "text-red-600"
          }`}
        >
          {tx.type === "INCOME" ? "+" : "-"}
          {tx.amount.toLocaleString("vi-VN")} đ
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setEditing((v) => !v)}
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
