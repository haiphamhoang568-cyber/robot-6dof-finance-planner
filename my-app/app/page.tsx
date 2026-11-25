import { connection } from "next/server";
import { Toaster } from "sonner";
import {
  ArrowDownLeft, ArrowUpRight, CalendarClock, CircuitBoard, ClipboardList,
  Plus, ScanLine, Wallet,
} from "lucide-react";
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
import { Category } from "../src/generated/prisma/enums";
import type { Prisma } from "../src/generated/prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import "./robot-dashboard.css";

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
  const hasFilters = month !== "all" || type !== "all" || category !== "all";

  return (
    <main className="robot-dashboard min-h-screen text-slate-100">
      <header className="robot-topbar">
        <div className="robot-container robot-topbar-inner">
          <a className="robot-brand" href="#tong-quan">
            <span className="robot-brand-mark" aria-hidden="true"><CircuitBoard size={21} /></span>
            <span>Phạm Hoàng Hải</span>
          </a>
          <nav className="robot-nav" aria-label="Điều hướng dự án">
            <a href="#tong-quan">Tổng quan</a>
            <a href="#giao-dich">Giao dịch</a>
            <a href="#linh-kien">Linh kiện</a>
            <a href="#ngan-sach">Ngân sách</a>
            <a href="#dinh-ky">Định kỳ</a>
          </nav>
          <LogoutButton />
        </div>
      </header>

      <div className="robot-container robot-content">
        <section id="tong-quan" className="robot-hero" aria-labelledby="robot-dashboard-title">
          <div className="robot-hero-copy">
            <h1 id="robot-dashboard-title">Quản lý thu chi <span>Robot 6DOF</span></h1>
            <p>Theo dõi tiền vào quỹ, chi phí chế tạo và kế hoạch mua linh kiện.</p>
            <a className="robot-hero-action" href="#giao-dich"><Plus size={17} aria-hidden="true" /> Ghi giao dịch</a>
          </div>
          <div className="robot-hero-visual" aria-hidden="true">
            <div className="robot-arm-drawing">
              <span className="robot-arm-orbit" />
              <span className="robot-arm-platform" />
              <span className="robot-arm-base" />
              <span className="robot-arm-link robot-arm-link-one" />
              <span className="robot-arm-link robot-arm-link-two" />
              <span className="robot-arm-link robot-arm-link-three" />
              <span className="robot-arm-joint robot-arm-shoulder" />
              <span className="robot-arm-joint robot-arm-elbow" />
              <span className="robot-arm-joint robot-arm-wrist" />
              <span className="robot-arm-gripper" />
            </div>
          </div>
        </section>

        <section aria-label="Tổng hợp quỹ robot">
          {hasFilters && <p className="robot-filter-note">Số liệu quỹ theo bộ lọc giao dịch đang chọn.</p>}
          <div className="robot-metrics">
            {[
              { title: "Quỹ còn lại", amount: balance, icon: Wallet, tone: "balance" },
              { title: "Tổng thu vào quỹ", amount: income, icon: ArrowDownLeft, tone: "income" },
              { title: "Chi phí chế tạo", amount: expense, icon: ArrowUpRight, tone: "expense" },
            ].map(({ title, amount, icon: Icon, tone }) => (
              <Card key={tone} className="robot-surface robot-metric" data-tone={tone}>
                <CardHeader>
                  <CardTitle className="robot-metric-label">
                    <span className="robot-metric-icon"><Icon size={18} aria-hidden="true" /></span>
                    {title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="robot-metric-value">{amount.toLocaleString("vi-VN")} <span>₫</span></p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="robot-charts">
          <MonthlyChart data={monthly} />
          <CategoryChart data={byCategory} />
        </div>

        <section id="giao-dich" className="robot-section" aria-labelledby="robot-transactions-title">
          <h2 id="robot-transactions-title"><ClipboardList size={21} aria-hidden="true" /> Sổ thu chi dự án</h2>
          <div className="robot-section-grid">
            <TransactionForm />
            <div className="robot-records">
              <h3>Giao dịch đã ghi</h3>
              <TransactionFilters month={month} category={category} type={type} />
              {transactions.length > 0 ? (
                <ul className="robot-list">
                  {transactions.map((tx) => <TransactionRow key={tx.id} tx={tx} />)}
                </ul>
              ) : (
                <p className="robot-empty">{hasFilters ? "Không có giao dịch khớp bộ lọc." : "Chưa có giao dịch nào."}</p>
              )}
            </div>
          </div>
        </section>

        <section id="linh-kien" className="robot-section" aria-labelledby="robot-parts-title">
          <h2 id="robot-parts-title"><CircuitBoard size={21} aria-hidden="true" /> Linh kiện dự kiến mua</h2>
          <div className="robot-section-grid">
            <WishlistForm />
            <div className="robot-records">
              <h3>Kế hoạch mua linh kiện</h3>
              {wishlist.length > 0 ? (
                <ul className="robot-list">
                  {wishlist.map((w) => <WishlistRow key={w.id} item={w} balance={balance} />)}
                </ul>
              ) : (
                <p className="robot-empty">Chưa có linh kiện nào trong danh sách mua.</p>
              )}
            </div>
          </div>
        </section>

        <section id="ngan-sach" className="robot-section" aria-labelledby="robot-budgets-title">
          <h2 id="robot-budgets-title"><ScanLine size={21} aria-hidden="true" /> Ngân sách theo hạng mục</h2>
          <div className="robot-section-grid">
            <BudgetForm />
            <div className="robot-records">
              <h3>Hạn mức tháng này</h3>
              {budgets.length > 0 ? (
                <ul className="robot-list">
                  {budgets.map((b) => (
                    <BudgetRow key={b.id} budget={b} spent={spentByCategory.get(b.category) ?? 0} />
                  ))}
                </ul>
              ) : (
                <p className="robot-empty">Chưa đặt hạn mức cho hạng mục nào.</p>
              )}
            </div>
          </div>
        </section>

        <section id="dinh-ky" className="robot-section" aria-labelledby="robot-recurring-title">
          <h2 id="robot-recurring-title"><CalendarClock size={21} aria-hidden="true" /> Thu chi định kỳ</h2>
          <div className="robot-section-grid">
            <RecurringForm />
            <div className="robot-records">
              <div className="robot-records-heading">
                <h3>Lịch thu chi hằng tháng</h3>
                <GenerateRecurringButton />
              </div>
              {recurring.length > 0 ? (
                <ul className="robot-list">
                  {recurring.map((r) => <RecurringRow key={r.id} item={r} />)}
                </ul>
              ) : (
                <p className="robot-empty">Chưa lên lịch khoản thu chi định kỳ.</p>
              )}
            </div>
          </div>
        </section>

        <InsightsPanel
          health={health}
          forecast={forecast}
          comparison={comparison}
          top={top}
          streak={streak}
          suggestion={suggestion}
        />
      </div>
      <Toaster theme="dark" position="bottom-right" />
    </main>
  );
}
