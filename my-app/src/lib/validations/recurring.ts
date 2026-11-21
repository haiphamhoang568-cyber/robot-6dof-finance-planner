import { z } from "zod";
import { TransactionType, Category } from "../../generated/prisma/client";

export const recurringSchema = z.object({
  amount: z
    .number({ error: "Số tiền phải là số" })
    .int("Số tiền phải là số nguyên (VND không có lẻ)")
    .positive("Số tiền phải lớn hơn 0"),
  description: z
    .string({ error: "Mô tả không được để trống" })
    .trim()
    .min(1, "Mô tả không được để trống")
    .max(120, "Mô tả tối đa 120 ký tự"),
  type: z.nativeEnum(TransactionType, { error: "Loại phải là Thu hoặc Chi" }),
  category: z.nativeEnum(Category, { error: "Chọn một danh mục" }),
  dayOfMonth: z
    .number({ error: "Ngày trong tháng phải là số" })
    .int("Ngày phải là số nguyên")
    .min(1, "Ngày từ 1 đến 28")
    .max(28, "Ngày từ 1 đến 28"),
});

export type RecurringInput = z.infer<typeof recurringSchema>;
