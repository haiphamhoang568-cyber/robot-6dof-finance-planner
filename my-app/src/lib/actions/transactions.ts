"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import { requireUser } from "../dal";
import { transactionSchema } from "../validations/transaction";

export type TransactionActionState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

export async function createTransaction(
  _prevState: TransactionActionState,
  formData: FormData
): Promise<TransactionActionState> {
  const user = await requireUser();

  const parsed = transactionSchema.safeParse({
    amount: Number(formData.get("amount")),
    description: formData.get("description"),
    type: formData.get("type"),
    category: formData.get("category"),
    date: formData.get("date"),
  });

  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  await prisma.transaction.create({
    data: { ...parsed.data, userId: user.id },
  });

  revalidatePath("/");
  return { ok: true, message: "Đã thêm giao dịch." };
}

export async function updateTransaction(
  _prevState: TransactionActionState,
  formData: FormData
): Promise<TransactionActionState> {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { ok: false, message: "Thiếu id giao dịch." };
  }

  const user = await requireUser();

  const parsed = transactionSchema.safeParse({
    amount: Number(formData.get("amount")),
    description: formData.get("description"),
    type: formData.get("type"),
    category: formData.get("category"),
    date: formData.get("date"),
  });

  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  await prisma.transaction.updateMany({
    where: { id, userId: user.id },
    data: parsed.data,
  });

  revalidatePath("/");
  return { ok: true, message: "Đã cập nhật giao dịch." };
}

export async function deleteTransaction(id: string) {
  const user = await requireUser();

  await prisma.transaction.deleteMany({
    where: { id, userId: user.id },
  });
  revalidatePath("/");
}
