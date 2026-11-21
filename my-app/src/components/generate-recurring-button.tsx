"use client";

import { useState } from "react";
import { generateRecurringForMonth } from "../lib/actions/recurring";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

export default function GenerateRecurringButton() {
  const [busy, setBusy] = useState(false);
  return (
    <Button
      type="button"
      disabled={busy}
      onClick={() => {
        setBusy(true);
        void generateRecurringForMonth().then(({ created }) => {
          setBusy(false);
          toast.success(
            created > 0
              ? `Đã tạo ${created} giao dịch định kỳ tháng này.`
              : "Tháng này đã tạo đủ rồi, không có món mới."
          );
        });
      }}
      className="rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 font-semibold text-slate-950 shadow-md shadow-fuchsia-500/30 hover:from-cyan-300 hover:to-fuchsia-400"
    >
      {busy ? "Đang tạo..." : "🔁 Tạo giao dịch tháng này"}
    </Button>
  );
}
