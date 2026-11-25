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
              : "Các khoản định kỳ của tháng này đã được ghi."
          );
        });
      }}
      className="robot-submit"
    >
      {busy ? "Đang tạo..." : "Tạo giao dịch tháng này"}
    </Button>
  );
}
