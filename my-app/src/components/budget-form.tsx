"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { upsertBudget } from "../lib/actions/budgets";
import { Category } from "../generated/prisma/enums";
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

export default function BudgetForm() {
  const [state, formAction, isPending] = useActionState(upsertBudget, {
    ok: false,
  });
  const [category, setCategory] = useState<Category>("FOOD");

  useEffect(() => {
    if (state.ok && state.message) {
      toast.success(state.message);
    }
  }, [state]);

  return (
    <Card className="rounded-3xl border-cyan-500/20 bg-slate-900/80 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
      <CardHeader>
        <CardTitle className="text-slate-100">💰 Đặt ngân sách tháng</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
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

            <div className="grid gap-2">
              <Label htmlFor="budget-limit" className="text-slate-200">Hạn mức (VND/tháng)</Label>
              <Input id="budget-limit" name="limit" type="number" min={1} step={1} required
                placeholder="2000000"
                className="rounded-xl border-slate-700 bg-slate-950/70 text-white placeholder:text-slate-500 focus-visible:ring-cyan-400" />
              {state.errors?.limit?.[0] && <p className="text-sm text-rose-400">{state.errors.limit[0]}</p>}
            </div>
          </div>

          <Button type="submit" disabled={isPending}
            className="w-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 font-semibold text-slate-950 shadow-md shadow-fuchsia-500/30 hover:from-cyan-300 hover:to-fuchsia-400">
            {isPending ? "Đang lưu..." : "Lưu ngân sách"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
