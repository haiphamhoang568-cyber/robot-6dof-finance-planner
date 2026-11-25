"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { toast } from "sonner";
import {
  createWishlistItem,
  updateWishlistItem,
} from "../lib/actions/wishlist";
import { Priority } from "../generated/prisma/enums";
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

const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: "Thấp",
  MEDIUM: "Trung bình",
  HIGH: "Cao",
};

export type WishlistFormData = {
  id: string;
  name: string;
  cost: number;
  priority: Priority;
  targetDate: Date | string | null;
};

export default function WishlistForm({
  item,
}: {
  item?: WishlistFormData;
}) {
  const inputId = useId();
  const isEditing = !!item;
  const action = isEditing ? updateWishlistItem : createWishlistItem;
  const [state, formAction, isPending] = useActionState(action, {
    ok: false,
  });
  const [priority, setPriority] = useState<Priority>(
    item?.priority ?? "MEDIUM"
  );
  const defaultTargetDate = item?.targetDate
    ? new Date(item.targetDate).toISOString().slice(0, 10)
    : "";

  useEffect(() => {
    if (state.ok && state.message) {
      toast.success(state.message);
    }
  }, [state]);

  return (
    <Card className="robot-surface">
      <CardHeader>
        <CardTitle className="text-slate-100">{isEditing ? "Sửa linh kiện" : "Thêm linh kiện cần mua"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          {item && <input type="hidden" name="id" value={item.id} />}

          <div className="grid gap-2">
            <Label htmlFor={`${inputId}-wishlist-name`} className="text-slate-200">Tên linh kiện</Label>
            <Input id={`${inputId}-wishlist-name`} name="name" type="text" maxLength={120} required
              placeholder="Driver HBS57" defaultValue={item?.name}
              className="rounded-xl border-slate-700 bg-slate-950/70 text-white placeholder:text-slate-500 focus-visible:ring-cyan-400" />
            {state.errors?.name?.[0] && <p className="text-sm text-rose-400">{state.errors.name[0]}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 min-[370px]:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor={`${inputId}-wishlist-cost`} className="text-slate-200">Giá dự kiến (VND)</Label>
              <Input id={`${inputId}-wishlist-cost`} name="cost" type="number" min={1} step={1} required
                placeholder="1500000" defaultValue={item?.cost}
                className="rounded-xl border-slate-700 bg-slate-950/70 text-white placeholder:text-slate-500 focus-visible:ring-cyan-400" />
              {state.errors?.cost?.[0] && <p className="text-sm text-rose-400">{state.errors.cost[0]}</p>}
            </div>

            <div className="grid gap-2">
              <Label className="text-slate-200">Ưu tiên</Label>
              <input type="hidden" name="priority" value={priority} />
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger aria-label="Mức ưu tiên" className="w-full">
                  <SelectValue>{PRIORITY_LABELS[priority]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Priority).map((p) => (
                    <SelectItem key={p} value={p}>{PRIORITY_LABELS[p]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`${inputId}-wishlist-target-date`} className="text-slate-200">Ngày dự kiến mua (không bắt buộc)</Label>
            <Input id={`${inputId}-wishlist-target-date`} name="targetDate" type="date" defaultValue={defaultTargetDate}
              className="rounded-xl border-slate-700 bg-slate-950/70 text-white placeholder:text-slate-500 focus-visible:ring-cyan-400" />
            {state.errors?.targetDate?.[0] && <p className="text-sm text-rose-400">{state.errors.targetDate[0]}</p>}
          </div>

          <Button type="submit" disabled={isPending}
            className="robot-submit w-full">
            {isPending ? "Đang lưu..." : isEditing ? "Lưu thay đổi" : "Lưu linh kiện"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
