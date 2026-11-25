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
  HIGH: "bg-amber-500/15 text-amber-200",
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
    <li className="robot-entry">
      <div className="robot-entry-line">
        <div className="robot-entry-details">
          <strong>{item.name}</strong>
          <div className="robot-entry-meta">
            <span>Ưu tiên</span>
            <Badge variant="secondary" className={PRIORITY_BADGE[item.priority]}>
              {PRIORITY_LABELS[item.priority]}
            </Badge>
          </div>
        </div>
        <div className="robot-entry-actions">
          <span className="robot-entry-amount text-cyan-300">
            {item.cost.toLocaleString("vi-VN")} ₫
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-expanded={editing}
            onClick={() => setEditing((v) => !v)}
            className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-200"
          >
            {editing ? "Đóng" : "Sửa"}
          </Button>
          <WishlistDeleteButton id={item.id} />
        </div>
      </div>
      <SavingsProgress milestone={milestone} />
      {item.targetDate && (
        <p className="mt-1 text-right text-xs text-slate-400">
          Dự kiến mua {new Date(item.targetDate).toLocaleDateString("vi-VN")} ·{" "}
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
