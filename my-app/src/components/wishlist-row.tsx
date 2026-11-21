"use client";

import { useState } from "react";
import WishlistForm, {
  type WishlistFormData,
} from "./wishlist-form";
import WishlistDeleteButton from "./wishlist-delete-button";
import SavingsProgress from "./savings-progress";
import { savingsMilestone } from "../lib/savings";
import { wishlistDailySaving } from "../lib/insights";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

const PRIORITY_LABELS: Record<WishlistFormData["priority"], string> = {
  LOW: "Thấp",
  MEDIUM: "Trung bình",
  HIGH: "Cao",
};

const PRIORITY_BADGE: Record<WishlistFormData["priority"], string> = {
  LOW: "bg-slate-800 text-slate-300",
  MEDIUM: "bg-cyan-500/15 text-cyan-300",
  HIGH: "bg-fuchsia-500/15 text-fuchsia-300",
};

export default function WishlistRow({
  item,
  balance,
}: {
  item: WishlistFormData;
  balance: number;
}) {
  const [editing, setEditing] = useState(false);
  const milestone = savingsMilestone(balance, item.cost);
  const deadline = wishlistDailySaving(balance, item.cost, item.targetDate);
  return (
    <li className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex-1 font-medium text-slate-100">{item.name}</span>
        <Badge variant="secondary" className={`rounded-full hover:bg-slate-800 ${PRIORITY_BADGE[item.priority]}`}>
          {PRIORITY_LABELS[item.priority]}
        </Badge>
        <span className="w-32 shrink-0 text-right text-sm font-semibold text-cyan-300">
          {item.cost.toLocaleString("vi-VN")} đ
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
        <WishlistDeleteButton id={item.id} />
      </div>
      <SavingsProgress milestone={milestone} />
      {item.targetDate && (
        <p className="mt-1 text-right text-xs text-slate-400">
          🎯 Hạn {new Date(item.targetDate).toLocaleDateString("vi-VN")} ·{" "}
          {deadline.reachable
            ? deadline.dailyNeeded === 0
              ? "đã đủ tiền!"
              : `còn ${deadline.daysLeft} ngày — cần ${deadline.dailyNeeded?.toLocaleString("vi-VN")} đ/ngày`
            : "đã quá hạn mà chưa đủ tiền"}
        </p>
      )}
      {editing && (
        <div className="mt-3">
          <WishlistForm item={item} />
        </div>
      )}
    </li>
  );
}
