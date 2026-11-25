"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import { requireUser } from "../dal";
import { recurringSchema } from "../validations/recurring";

export type RecurringActionState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

export async function createRecurring(
  _prevState: RecurringActionState,
  formData: FormData
): Promise<RecurringActionState> {
  const user = await requireUser();

  const parsed = recurringSchema.safeParse({
    amount: Number(formData.get("amount")),
    description: formData.get("description"),
    type: formData.get("type"),
    category: formData.get("category"),
    dayOfMonth: Number(formData.get("dayOfMonth")),
  });

  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  await prisma.recurringTransaction.create({
    data: { ...parsed.data, userId: user.id },
  });

  revalidatePath("/");
  return { ok: true, message: "Đã thêm khoản định kỳ." };
}

export async function updateRecurring(
  _prevState: RecurringActionState,
  formData: FormData
): Promise<RecurringActionState> {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { ok: false, message: "Thiếu mã khoản định kỳ." };
  }

  const user = await requireUser();

  const parsed = recurringSchema.safeParse({
    amount: Number(formData.get("amount")),
    description: formData.get("description"),
    type: formData.get("type"),
    category: formData.get("category"),
    dayOfMonth: Number(formData.get("dayOfMonth")),
  });

  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  await prisma.recurringTransaction.updateMany({
    where: { id, userId: user.id },
    data: parsed.data,
  });

  revalidatePath("/");
  return { ok: true, message: "Đã cập nhật khoản định kỳ." };
}

export async function deleteRecurring(id: string) {
  const user = await requireUser();

  await prisma.recurringTransaction.deleteMany({
    where: { id, userId: user.id },
  });
  revalidatePath("/");
}

// Tạo giao dịch tháng này từ các mẫu định kỳ (bỏ qua mẫu đã tạo rồi trong tháng).
export async function generateRecurringForMonth(): Promise<{ created: number }> {
  const user = await requireUser();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 1);

  const templates = await prisma.recurringTransaction.findMany({
    where: { userId: user.id },
  });

  let created = 0;
  for (const t of templates) {
    const existing = await prisma.transaction.findFirst({
      where: {
        userId: user.id,
        description: t.description,
        amount: t.amount,
        type: t.type,
        date: { gte: monthStart, lt: monthEnd },
      },
    });
    if (existing) continue;
    const day = Math.min(t.dayOfMonth, daysInMonth);
    await prisma.transaction.create({
      data: {
        userId: user.id,
        amount: t.amount,
        description: t.description,
        type: t.type,
        category: t.category,
        date: new Date(year, month, day),
      },
    });
    created++;
  }

  revalidatePath("/");
  return { created };
}
