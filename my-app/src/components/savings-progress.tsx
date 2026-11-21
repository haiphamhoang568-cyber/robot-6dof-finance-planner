import type { SavingsMilestone } from "../lib/savings";

export default function SavingsProgress({
  milestone,
}: {
  milestone: SavingsMilestone;
}) {
  return (
    <div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
          style={{ width: `${milestone.percent}%` }}
        />
      </div>
      <p className="mt-1 text-right text-xs text-slate-400">
        {milestone.reached
          ? "Đã đủ tiền!"
          : `Đã đủ ${milestone.percent}% — còn thiếu ${milestone.remaining.toLocaleString("vi-VN")} đ`}
      </p>
    </div>
  );
}
