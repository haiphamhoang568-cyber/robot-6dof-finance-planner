"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import { requireUser } from "../dal";
import { budgetSchema } from "../validations/budget";

export type BudgetActionState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

export async function upsertBudget(
  _prevState: BudgetActionState,
  formData: FormData
): Promise<BudgetActionState> {
  const user = await requireUser();

  const parsed = budgetSchema.safeParse({
    category: formData.get("category"),
    limit: Number(formData.get("limit")),
  });

  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  await prisma.budget.upsert({
    where: { userId_category: { userId: user.id, category: parsed.data.category } },
    update: { limit: parsed.data.limit },
    create: { ...parsed.data, userId: user.id },
  });

  revalidatePath("/");
  return { ok: true, message: "Đã lưu ngân sách." };
}

export async function deleteBudget(id: string) {
  const user = await requireUser();

  await prisma.budget.deleteMany({
    where: { id, userId: user.id },
  });
  revalidatePath("/");
}
