"use client";

import { deleteTransaction } from "../lib/actions/transactions";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

export default function DeleteButton({ id }: { id: string }) {
  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      onClick={() => {
        if (confirm("Xóa giao dịch này?")) {
          void deleteTransaction(id).then(() =>
            toast.success("Đã xóa giao dịch.")
          );
        }
      }}
    >
      Xóa
    </Button>
  );
}
