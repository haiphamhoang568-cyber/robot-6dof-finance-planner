export type MonthlyTotal = {
  month: string;
  income: number;
  expense: number;
};

export type CategoryTotal = {
  category: string;
  total: number;
};

type ChartTx = {
  date: Date | string;
  type: "INCOME" | "EXPENSE";
  category: string;
  amount: number;
};

function monthKey(d: Date): string {
  return `${d.getMonth() + 1}/${d.getFullYear()}`;
}

/**
 * Tổng thu/chi theo tháng cho `monthsBack` tháng gần nhất (tính cả tháng hiện tại),
 * trả về theo thứ tự tháng cũ tới mới. Hàm thuần, không đọc DB.
 */
export function monthlyTotals(
  transactions: ChartTx[],
  monthsBack = 6,
  now = new Date()
): MonthlyTotal[] {
  const months: MonthlyTotal[] = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ month: monthKey(d), income: 0, expense: 0 });
  }
  const byMonth = new Map(months.map((m) => [m.month, m]));
  for (const tx of transactions) {
    const key = monthKey(new Date(tx.date));
    const bucket = byMonth.get(key);
    if (!bucket) continue;
    if (tx.type === "INCOME") bucket.income += tx.amount;
    else bucket.expense += tx.amount;
  }
  return months;
}

/**
 * Tổng chi theo danh mục, sắp xếp giảm dần. Hàm thuần, không đọc DB.
 */
export function expenseByCategory(transactions: ChartTx[]): CategoryTotal[] {
  const totals = new Map<string, number>();
  for (const tx of transactions) {
    if (tx.type !== "EXPENSE") continue;
    totals.set(tx.category, (totals.get(tx.category) ?? 0) + tx.amount);
  }
  return [...totals.entries()]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}
