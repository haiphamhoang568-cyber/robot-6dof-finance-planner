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
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Sửa giao dịch" : "Thêm giao dịch"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          {transaction && <input type="hidden" name="id" value={transaction.id} />}

          <div className="grid gap-2">
            <Label htmlFor="amount">Số tiền (VND)</Label>
            <Input id="amount" name="amount" type="number" min={1} step={1} required
              placeholder="400000" defaultValue={transaction?.amount} />
            {state.errors?.amount?.[0] && <p className="text-sm text-red-600">{state.errors.amount[0]}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Mô tả</Label>
            <Input id="description" name="description" type="text" maxLength={120} required
              placeholder="Ăn trưa" defaultValue={transaction?.description} />
            {state.errors?.description?.[0] && <p className="text-sm text-red-600">{state.errors.description[0]}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Loại</Label>
              <input type="hidden" name="type" value={type} />
              <Select value={type} onValueChange={(v) => setType(v as TransactionType)}>
                <SelectTrigger>
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
              <Label>Danh mục</Label>
              <input type="hidden" name="category" value={category} />
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger>
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
            <Label htmlFor="date">Ngày</Label>
            <Input id="date" name="date" type="date" required defaultValue={defaultDate} />
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Đang lưu..." : isEditing ? "Lưu thay đổi" : "Thêm giao dịch"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
