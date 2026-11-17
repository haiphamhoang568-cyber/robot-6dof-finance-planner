"use client";

import { useActionState } from "react";
import {
  createTransaction,
  updateTransaction,
} from "../lib/actions/transactions";
import { TransactionType, Category } from "../generated/prisma/enums";

const TYPE_LABELS: Record<TransactionType, string> = {
  INCOME: "Thu",
  EXPENSE: "Chi",
};

export type TransactionFormData = {
  id: string;
  amount: number;
  description: string;
  type: TransactionType;
  category: Category;
  date: Date | string;
};

export default function TransactionForm({
  transaction,
}: {
  transaction?: TransactionFormData;
}) {
  const isEditing = !!transaction;
  const action = isEditing ? updateTransaction : createTransaction;
  const [state, formAction, isPending] = useActionState(action, {
    ok: false,
  });
  const today = new Date().toISOString().slice(0, 10);
  const defaultDate = transaction
    ? new Date(transaction.date).toISOString().slice(0, 10)
    : today;

  return (
    <form action={formAction} className="flex flex-col gap-3 rounded border p-4">
      {transaction && <input type="hidden" name="id" value={transaction.id} />}

      <input name="amount" type="number" min={1} step={1} required placeholder="Số tiền (VND)" defaultValue={transaction?.amount} className="rounded border p-2" />
      {state.errors?.amount?.[0] && <p className="text-sm text-red-600">{state.errors.amount[0]}</p>}

      <input name="description" type="text" maxLength={120} required placeholder="Mô tả (tối đa 120 ký tự)" defaultValue={transaction?.description} className="rounded border p-2" />
      {state.errors?.description?.[0] && <p className="text-sm text-red-600">{state.errors.description[0]}</p>}

      <select name="type" required defaultValue={transaction?.type} className="rounded border p-2">
        {Object.values(TransactionType).map((t) => (
          <option key={t} value={t}>{TYPE_LABELS[t]}</option>
        ))}
      </select>

      <select name="category" required defaultValue={transaction?.category} className="rounded border p-2">
        {Object.values(Category).map((c) => (
          <option key={c} value={c}>{c.replaceAll("_", " ")}</option>
        ))}
      </select>

      <input name="date" type="date" required defaultValue={defaultDate} className="rounded border p-2" />

      <button type="submit" disabled={isPending} className="rounded bg-black p-2 text-white disabled:opacity-50">
        {isPending ? "Đang lưu..." : isEditing ? "Lưu thay đổi" : "Thêm giao dịch"}
      </button>

      {state.ok && state.message && <p className="text-sm text-green-600">{state.message}</p>}
    </form>
  );
}
