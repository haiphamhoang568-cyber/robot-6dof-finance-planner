import { z } from "zod";
import { Category } from "../../generated/prisma/client";

export const budgetSchema = z.object({
  category: z.nativeEnum(Category, { error: "Chọn một danh mục" }),
  limit: z
    .number({ error: "Hạn mức phải là số" })
    .int("Hạn mức phải là số nguyên (VND không có lẻ)")
    .positive("Hạn mức phải lớn hơn 0"),
});

export type BudgetInput = z.infer<typeof budgetSchema>;
