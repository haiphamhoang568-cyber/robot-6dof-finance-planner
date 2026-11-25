"use client";

import { deleteWishlistItem } from "../lib/actions/wishlist";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

export default function WishlistDeleteButton({ id }: { id: string }) {
  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      onClick={() => {
        if (confirm("Xóa linh kiện này khỏi danh sách mua?")) {
          void deleteWishlistItem(id).then(() =>
            toast.success("Đã xóa linh kiện khỏi danh sách mua.")
          );
        }
      }}
    >
      Xóa
    </Button>
  );
}
