"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  createTransaction,
  updateTransaction,
} from "../lib/actions/transactions";
import { TransactionType, Category } from "../generated/prisma/enums";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

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
  const [type, setType] = useState<TransactionType>(
    transaction?.type ?? "INCOME"
  );
  const [category, setCategory] = useState<Category>(
    transaction?.category ?? "FOOD"
  );
  const today = new Date().toISOString().slice(0, 10);
  const defaultDate = transaction
    ? new Date(transaction.date).toISOString().slice(0, 10)
    : today;

  useEffect(() => {
    if (state.ok && state.message) {
      toast.success(state.message);
    }
  }, [state]);

  return (
    <Card className="rounded-3xl border-cyan-500/20 bg-slate-900/80 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
      <CardHeader>
        <CardTitle className="text-slate-100">{isEditing ? "✏️ Sửa giao dịch" : "✨ Thêm giao dịch"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          {transaction && <input type="hidden" name="id" value={transaction.id} />}

          <div className="grid gap-2">
            <Label htmlFor="amount" className="text-slate-200">Số tiền (VND)</Label>
            <Input id="amount" name="amount" type="number" min={1} step={1} required
              placeholder="400000" defaultValue={transaction?.amount}
              className="rounded-xl border-slate-700 bg-slate-950/70 text-white placeholder:text-slate-500 focus-visible:ring-cyan-400" />
            {state.errors?.amount?.[0] && <p className="text-sm text-rose-400">{state.errors.amount[0]}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="text-slate-200">Mô tả</Label>
            <Input id="description" name="description" type="text" maxLength={120} required
              placeholder="Ăn trưa" defaultValue={transaction?.description}
              className="rounded-xl border-slate-700 bg-slate-950/70 text-white placeholder:text-slate-500 focus-visible:ring-cyan-400" />
            {state.errors?.description?.[0] && <p className="text-sm text-rose-400">{state.errors.description[0]}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-slate-200">Loại</Label>
              <input type="hidden" name="type" value={type} />
              <Select value={type} onValueChange={(v) => setType(v as TransactionType)}>
                <SelectTrigger className="rounded-xl border-slate-700 bg-slate-950/70 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TransactionType).map((t) => (
                    <SelectItem key={t} value={t}>{TYPE_LABELS[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="text-slate-200">Danh mục</Label>
              <input type="hidden" name="category" value={category} />
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger className="rounded-xl border-slate-700 bg-slate-950/70 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Category).map((c) => (
                    <SelectItem key={c} value={c}>{c.replaceAll("_", " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date" className="text-slate-200">Ngày</Label>
            <Input id="date" name="date" type="date" required defaultValue={defaultDate}
              className="rounded-xl border-slate-700 bg-slate-950/70 text-white placeholder:text-slate-500 focus-visible:ring-cyan-400" />
          </div>

          <Button type="submit" disabled={isPending}
            className="w-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 font-semibold text-slate-950 shadow-md shadow-fuchsia-500/30 hover:from-cyan-300 hover:to-fuchsia-400">
            {isPending ? "Đang lưu..." : isEditing ? "Lưu thay đổi" : "Thêm giao dịch"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
