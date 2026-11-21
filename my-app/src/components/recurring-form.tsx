"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { createRecurring, updateRecurring } from "../lib/actions/recurring";
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

export type RecurringFormData = {
  id: string;
  amount: number;
  description: string;
  type: TransactionType;
  category: Category;
  dayOfMonth: number;
};

export default function RecurringForm({
  item,
}: {
  item?: RecurringFormData;
}) {
  const isEditing = !!item;
  const action = isEditing ? updateRecurring : createRecurring;
  const [state, formAction, isPending] = useActionState(action, {
    ok: false,
  });
  const [type, setType] = useState<TransactionType>(item?.type ?? "EXPENSE");
  const [category, setCategory] = useState<Category>(item?.category ?? "BILLS");

  useEffect(() => {
    if (state.ok && state.message) {
      toast.success(state.message);
    }
  }, [state]);

  return (
    <Card className="rounded-3xl border-cyan-500/20 bg-slate-900/80 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
      <CardHeader>
        <CardTitle className="text-slate-100">{isEditing ? "✏️ Sửa hóa đơn định kỳ" : "🔁 Thêm hóa đơn định kỳ"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          {item && <input type="hidden" name="id" value={item.id} />}

          <div className="grid gap-2">
            <Label htmlFor="recurring-description" className="text-slate-200">Mô tả</Label>
            <Input id="recurring-description" name="description" type="text" maxLength={120} required
              placeholder="Tiền nhà" defaultValue={item?.description}
              className="rounded-xl border-slate-700 bg-slate-950/70 text-white placeholder:text-slate-500 focus-visible:ring-cyan-400" />
            {state.errors?.description?.[0] && <p className="text-sm text-rose-400">{state.errors.description[0]}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="recurring-amount" className="text-slate-200">Số tiền (VND)</Label>
              <Input id="recurring-amount" name="amount" type="number" min={1} step={1} required
                placeholder="3000000" defaultValue={item?.amount}
                className="rounded-xl border-slate-700 bg-slate-950/70 text-white placeholder:text-slate-500 focus-visible:ring-cyan-400" />
              {state.errors?.amount?.[0] && <p className="text-sm text-rose-400">{state.errors.amount[0]}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="recurring-day" className="text-slate-200">Ngày trong tháng (1–28)</Label>
              <Input id="recurring-day" name="dayOfMonth" type="number" min={1} max={28} step={1} required
                placeholder="5" defaultValue={item?.dayOfMonth ?? 5}
                className="rounded-xl border-slate-700 bg-slate-950/70 text-white placeholder:text-slate-500 focus-visible:ring-cyan-400" />
              {state.errors?.dayOfMonth?.[0] && <p className="text-sm text-rose-400">{state.errors.dayOfMonth[0]}</p>}
            </div>
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

          <Button type="submit" disabled={isPending}
            className="w-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 font-semibold text-slate-950 shadow-md shadow-fuchsia-500/30 hover:from-cyan-300 hover:to-fuchsia-400">
            {isPending ? "Đang lưu..." : isEditing ? "Lưu thay đổi" : "Thêm hóa đơn định kỳ"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
