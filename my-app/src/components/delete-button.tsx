"use client";

import { deleteTransaction } from "../lib/actions/transactions";

export default function DeleteButton({ id }: { id: string }) {
  return (
    <button
      type="button"
      className="rounded border px-2 py-1 text-sm text-red-600"
      onClick={async () => {
        if (confirm("Xoá giao dịch này?")) {
          await deleteTransaction(id);
        }
      }}
    >
      Xoá
    </button>
  );
}
