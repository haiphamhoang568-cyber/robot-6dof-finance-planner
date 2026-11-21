import { connection } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { requireUser } from "@/src/lib/dal";
import TransactionForm from "../src/components/transaction-form";
import TransactionRow from "../src/components/transaction-row";
import TransactionFilters from "../src/components/transaction-filters";
import WishlistForm from "../src/components/wishlist-form";
import WishlistRow from "../src/components/wishlist-row";
import MonthlyChart from "../src/components/monthly-chart";
import CategoryChart from "../src/components/category-chart";
import InsightsPanel from "../src/components/insights-panel";
import BudgetForm from "../src/components/budget-form";
import BudgetRow from "../src/components/budget-row";
import RecurringForm from "../src/components/recurring-form";
import RecurringRow from "../src/components/recurring-row";
import GenerateRecurringButton from "../src/components/generate-recurring-button";
import { monthlyTotals, expenseByCategory } from "../src/lib/charts";
import {
  financialHealthScore,
  forecastEndOfMonth,
  monthComparison,
  topExpenses,
  loggingStreak,
  savingsSuggestion,
} from "../src/lib/insights";
import LogoutButton from "../src/components/logout-button";
import NeonOrbs from "../src/components/neon-orbs";
import { Category } from "../src/generated/prisma/enums";
import type { Prisma } from "../src/generated/prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

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
  await connection();
  const sp = await searchParams;
  const month = sp.month ?? "all";
  const type = sp.type ?? "all";
  const category = sp.category ?? "all";

  const user = await requireUser();

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
  const allTransactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });
  const budgets = await prisma.budget.findMany({
    where: { userId: user.id },
    orderBy: { category: "asc" },
  });
  const recurring = await prisma.recurringTransaction.findMany({
    where: { userId: user.id },
    orderBy: { dayOfMonth: "asc" },
  });
  const monthly = monthlyTotals(allTransactions);
  const byCategory = expenseByCategory(allTransactions);

  const now = new Date();
  const thisMonthTx = allTransactions.filter(
    (t) => t.date.getFullYear() === now.getFullYear() && t.date.getMonth() === now.getMonth()
  );
  const streak = loggingStreak(allTransactions, now);
  const health = financialHealthScore(allTransactions, streak, now);
  const totalBalance = allTransactions.reduce(
    (s, t) => s + (t.type === "INCOME" ? t.amount : -t.amount),
    0
  );
  const forecast = forecastEndOfMonth(allTransactions, totalBalance, now);
  const comparison = monthComparison(allTransactions, now);
  const top = topExpenses(thisMonthTx, 5);
  const suggestion = savingsSuggestion(allTransactions, now);
  const spentByCategory = new Map<string, number>();
  for (const t of thisMonthTx) {
    if (t.type !== "EXPENSE") continue;
    spentByCategory.set(t.category, (spentByCategory.get(t.category) ?? 0) + t.amount);
  }

  const income = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((s, t) => s + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8">
      <div aria-hidden className="neon-grid pointer-events-none absolute inset-0" />
      <div aria-hidden className="pointer-events-none absolute -left-20 top-16 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute right-0 top-1/3 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <NeonOrbs />
      <div className="relative mx-auto max-w-3xl space-y-6">
        <header className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-900/80 p-6 shadow-[0_0_40px_rgba(34,211,238,0.15)] sm:p-8">
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rotate-45 bg-cyan-400 shadow-[0_0_12px_2px_rgba(34,211,238,0.8)]" />
                <h1 className="font-cyber neon-text-cyan text-2xl text-white sm:text-3xl">Minh Ân</h1>
              </div>
              <p className="mt-2 text-sm text-slate-400">thằng không có tiền dạy người có tiền quản lý tiền bạc</p>
              <div className="mt-3 h-px w-48 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-transparent" />
            </div>
            <LogoutButton />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="rounded-3xl border-cyan-500/20 bg-slate-900/80 shadow-[0_0_25px_rgba(34,211,238,0.08)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-cyan-300">💰 Số dư</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">{balance.toLocaleString("vi-VN")} đ</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-cyan-500/20 bg-slate-900/80 shadow-[0_0_25px_rgba(34,211,238,0.08)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-cyan-300">📈 Tổng thu</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-cyan-300">{income.toLocaleString("vi-VN")} đ</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-fuchsia-500/20 bg-slate-900/80 shadow-[0_0_25px_rgba(232,121,249,0.08)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-fuchsia-300">📉 Tổng chi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-fuchsia-400">{expense.toLocaleString("vi-VN")} đ</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <MonthlyChart data={monthly} />
          <CategoryChart data={byCategory} />
        </div>

        <InsightsPanel
          health={health}
          forecast={forecast}
          comparison={comparison}
          top={top}
          streak={streak}
          suggestion={suggestion}
        />

        <TransactionForm />

        <h2 className="text-xl font-semibold text-slate-100">🧾 Giao dịch</h2>
        <TransactionFilters month={month} category={category} type={type} />
        <ul className="space-y-3">
          {transactions.map((tx) => (
            <TransactionRow key={tx.id} tx={tx} />
          ))}
        </ul>

        <h2 className="text-xl font-semibold text-slate-100">🎁 Wishlist</h2>
        <WishlistForm />
        <ul className="space-y-3">
          {wishlist.map((w) => (
            <WishlistRow key={w.id} item={w} balance={balance} />
          ))}
        </ul>

        <h2 className="text-xl font-semibold text-slate-100">💰 Ngân sách tháng</h2>
        <BudgetForm />
        <ul className="space-y-3">
          {budgets.map((b) => (
            <BudgetRow
              key={b.id}
              budget={b}
              spent={spentByCategory.get(b.category) ?? 0}
            />
          ))}
        </ul>

        <h2 className="text-xl font-semibold text-slate-100">🔁 Hóa đơn định kỳ</h2>
        <div className="flex flex-wrap items-center gap-3">
          <GenerateRecurringButton />
        </div>
        <RecurringForm />
        <ul className="space-y-3">
          {recurring.map((r) => (
            <RecurringRow key={r.id} item={r} />
          ))}
        </ul>
      </div>
    </main>
  );
}
