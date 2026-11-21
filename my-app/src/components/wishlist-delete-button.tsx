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
        if (confirm("Xóa món này khỏi wishlist?")) {
          void deleteWishlistItem(id).then(() =>
            toast.success("Đã xóa khỏi wishlist.")
          );
        }
      }}
    >
      Xóa
    </Button>
  );
}
