import { prisma } from "@/src/lib/prisma";
import TransactionForm from "../src/components/transaction-form";
import TransactionRow from "../src/components/transaction-row";
import TransactionFilters from "../src/components/transaction-filters";
import { Category } from "../src/generated/prisma/enums";
import type { Prisma } from "../src/generated/prisma/client";

export const instant = false;

function monthRange(month: string): { gte: Date; lt: Date } | null {
  const now = new Date();
  if (month === "this") {
    return {
      gte: new Date(now.getFullYear(), now.getMonth(), 1),
      lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
    };
  }
  if (month === "last") {
    return {
      gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      lt: new Date(now.getFullYear(), now.getMonth(), 1),
    };
  }
  return null;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; category?: string; type?: string }>;
}) {
  const sp = await searchParams;
  const month = sp.month ?? "all";
  const type = sp.type ?? "all";
  const category = sp.category ?? "all";

  const user = await prisma.user.findUnique({
    where: { email: "demo@finance.local" },
  });
  if (!user) return <main>pay me 100$ to look user</main>;

  const validCategory = Object.values(Category).includes(category as Category)
    ? (category as Category)
    : undefined;
  const range = monthRange(month);

  const where: Prisma.TransactionWhereInput = {
    userId: user.id,
    ...(type === "INCOME" || type === "EXPENSE" ? { type } : {}),
    ...(validCategory ? { category: validCategory } : {}),
    ...(range ? { date: range } : {}),
  };

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: { date: "desc" },
  });
  const wishlist = await prisma.wishlistItem.findMany({
    where: { userId: user.id },
  });

  const income = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((s, t) => s + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  return (
    <main>
      <h1>Finance Planner</h1>
      <p>Số dư: {balance.toLocaleString("vi-VN")} đ</p>
      <p>Tổng thu: {income.toLocaleString("vi-VN")} đ</p>
      <p>Tổng chi: {expense.toLocaleString("vi-VN")} đ</p>
      <TransactionForm />
      <h2>Giao dịch</h2>
      <TransactionFilters month={month} category={category} type={type} />
      <ul>
        {transactions.map((tx) => (
          <TransactionRow key={tx.id} tx={tx} />
        ))}
      </ul>

      <h2>Wishlist</h2>
      <ul>
        {wishlist.map((w) => (
          <li key={w.id}>
            {w.name} — {w.cost.toLocaleString("vi-VN")} đ —{" "}
            {Math.min(100, Math.max(0, Math.round((balance / w.cost) * 100)))}%
          </li>
        ))}
      </ul>
    </main>
  );
}
