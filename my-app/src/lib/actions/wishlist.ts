"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import { requireUser } from "../dal";
import { wishlistSchema } from "../validations/wishlist";

export type WishlistActionState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

export async function createWishlistItem(
  _prevState: WishlistActionState,
  formData: FormData
): Promise<WishlistActionState> {
  const user = await requireUser();

  const rawDate = formData.get("targetDate");
  const parsed = wishlistSchema.safeParse({
    name: formData.get("name"),
    cost: Number(formData.get("cost")),
    priority: formData.get("priority"),
    targetDate: rawDate === "" || rawDate === null ? undefined : rawDate,
  });

  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  await prisma.wishlistItem.create({
    data: { ...parsed.data, userId: user.id },
  });

  revalidatePath("/");
  return { ok: true, message: "Đã thêm linh kiện vào danh sách mua." };
}

export async function updateWishlistItem(
  _prevState: WishlistActionState,
  formData: FormData
): Promise<WishlistActionState> {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { ok: false, message: "Thiếu mã linh kiện." };
  }

  const user = await requireUser();

  const rawDate = formData.get("targetDate");
  const parsed = wishlistSchema.safeParse({
    name: formData.get("name"),
    cost: Number(formData.get("cost")),
    priority: formData.get("priority"),
    targetDate: rawDate === "" || rawDate === null ? undefined : rawDate,
  });

  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  await prisma.wishlistItem.updateMany({
    where: { id, userId: user.id },
    data: {
      name: parsed.data.name,
      cost: parsed.data.cost,
      priority: parsed.data.priority,
      targetDate: rawDate === "" || rawDate === null ? null : parsed.data.targetDate,
    },
  });

  revalidatePath("/");
  return { ok: true, message: "Đã cập nhật linh kiện." };
}

export async function deleteWishlistItem(id: string) {
  const user = await requireUser();

  await prisma.wishlistItem.deleteMany({
    where: { id, userId: user.id },
  });
  revalidatePath("/");
}
