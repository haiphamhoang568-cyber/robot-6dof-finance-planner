"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { toast } from "sonner";
import {
  createTransaction,
  updateTransaction,
} from "../lib/actions/transactions";
import { TransactionType, Category } from "../generated/prisma/enums";
import { ROBOT_TYPE_LABELS, robotCategoryLabel } from "../lib/robot-labels";
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
  const inputId = useId();
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
    <Card className="robot-surface">
      <CardHeader>
        <CardTitle className="text-slate-100">{isEditing ? "Sửa giao dịch" : "Ghi giao dịch mới"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          {transaction && <input type="hidden" name="id" value={transaction.id} />}

          <div className="grid gap-2">
            <Label htmlFor={`${inputId}-amount`} className="text-slate-200">Số tiền (VND)</Label>
            <Input id={`${inputId}-amount`} name="amount" type="number" min={1} step={1} required
              placeholder="400000" defaultValue={transaction?.amount}
              className="rounded-xl border-slate-700 bg-slate-950/70 text-white placeholder:text-slate-500 focus-visible:ring-cyan-400" />
            {state.errors?.amount?.[0] && <p className="text-sm text-rose-400">{state.errors.amount[0]}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`${inputId}-description`} className="text-slate-200">Mô tả</Label>
            <Input id={`${inputId}-description`} name="description" type="text" maxLength={120} required
              placeholder={type === "INCOME" ? "Đóng góp quỹ chế tạo" : "Mua driver cho khớp J2"} defaultValue={transaction?.description}
              className="rounded-xl border-slate-700 bg-slate-950/70 text-white placeholder:text-slate-500 focus-visible:ring-cyan-400" />
            {state.errors?.description?.[0] && <p className="text-sm text-rose-400">{state.errors.description[0]}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 min-[370px]:grid-cols-2">
            <div className="grid gap-2">
              <Label className="text-slate-200">Loại giao dịch</Label>
              <input type="hidden" name="type" value={type} />
              <Select value={type} onValueChange={(v) => setType(v as TransactionType)}>
                <SelectTrigger aria-label="Loại giao dịch" className="w-full">
                  <SelectValue>{ROBOT_TYPE_LABELS[type]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TransactionType).map((t) => (
                    <SelectItem key={t} value={t}>{ROBOT_TYPE_LABELS[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="text-slate-200">Hạng mục</Label>
              <input type="hidden" name="category" value={category} />
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger aria-label="Hạng mục" className="w-full">
                  <SelectValue>{robotCategoryLabel(category)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Category).map((c) => (
                    <SelectItem key={c} value={c}>{robotCategoryLabel(c)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`${inputId}-date`} className="text-slate-200">Ngày giao dịch</Label>
            <Input id={`${inputId}-date`} name="date" type="date" required defaultValue={defaultDate}
              className="rounded-xl border-slate-700 bg-slate-950/70 text-white placeholder:text-slate-500 focus-visible:ring-cyan-400" />
          </div>

          <Button type="submit" disabled={isPending}
            className="robot-submit w-full">
            {isPending ? "Đang lưu..." : isEditing ? "Lưu thay đổi" : "Lưu giao dịch"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
