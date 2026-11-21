import { z } from "zod";
import { Priority } from "../../generated/prisma/client";

export const wishlistSchema = z.object({
  name: z
    .string({ error: "Tên không được để trống" })
    .trim()
    .min(1, "Tên không được để trống")
    .max(120, "Tên tối đa 120 ký tự"),
  cost: z
    .number({ error: "Giá phải là số" })
    .int("Giá phải là số nguyên (VND không có lẻ)")
    .positive("Giá phải lớn hơn 0"),
  priority: z.nativeEnum(Priority, { error: "Chọn mức ưu tiên" }),
  targetDate: z.coerce.date({ error: "Ngày mục tiêu không hợp lệ" }).optional(),
});

export type WishlistInput = z.infer<typeof wishlistSchema>;
