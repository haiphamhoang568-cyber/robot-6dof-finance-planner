export type TxLike = {
  date: Date | string;
  type: "INCOME" | "EXPENSE";
  category: string;
  amount: number;
  description?: string;
};

function toDate(d: Date | string): Date {
  return d instanceof Date ? d : new Date(d);
}

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}`;
}

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function monthTotals(transactions: TxLike[], year: number, month: number) {
  let income = 0;
  let expense = 0;
  for (const tx of transactions) {
    const d = toDate(tx.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      if (tx.type === "INCOME") income += tx.amount;
      else expense += tx.amount;
    }
  }
  return { income, expense };
}

// 1. Điểm sức khỏe tài chính 0-100: 60% tỉ lệ tiết kiệm tháng này + 40% streak ghi chép.
export type HealthScore = {
  score: number;
  label: string;
  savingsRate: number;
  streak: number;
};

export function financialHealthScore(
  transactions: TxLike[],
  streak: number,
  now = new Date()
): HealthScore {
  const { income, expense } = monthTotals(transactions, now.getFullYear(), now.getMonth());
  const savingsRate =
    income > 0 ? Math.max(0, Math.min(100, Math.round(((income - expense) / income) * 100))) : 0;
  const streakScore = Math.min(100, Math.round((Math.max(0, streak) / 30) * 100));
  const score = Math.round(0.6 * savingsRate + 0.4 * streakScore);
  const label = score >= 80 ? "Xuất sắc" : score >= 60 ? "Tốt" : score >= 40 ? "Ổn" : "Cần cải thiện";
  return { score, label, savingsRate, streak };
}

// 2. Dự báo số dư cuối tháng: giữ nguyên tốc độ chi/ngày hiện tại của tháng này.
export type Forecast = {
  dailyExpenseRate: number;
  daysRemaining: number;
  projectedBalance: number;
  willBeNegative: boolean;
};

export function forecastEndOfMonth(
  transactions: TxLike[],
  balance: number,
  now = new Date()
): Forecast {
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysElapsed = now.getDate();
  const daysRemaining = Math.max(0, daysInMonth - daysElapsed);
  const { expense } = monthTotals(transactions, now.getFullYear(), now.getMonth());
  const dailyExpenseRate = daysElapsed > 0 ? Math.round(expense / daysElapsed) : 0;
  const projectedBalance = balance - dailyExpenseRate * daysRemaining;
  return { dailyExpenseRate, daysRemaining, projectedBalance, willBeNegative: projectedBalance < 0 };
}

// 3. Mô phỏng "nếu cắt chi": cắt X đ/tháng thì tiết kiệm được bao nhiêu sau 3/6/12 tháng.
export function whatIfSavings(monthlyCut: number): { m3: number; m6: number; m12: number } {
  const cut = Math.max(0, Math.floor(monthlyCut));
  return { m3: cut * 3, m6: cut * 6, m12: cut * 12 };
}

// 4. So sánh với tháng trước: % thay đổi thu/chi. Trả null khi tháng trước bằng 0 mà tháng này khác 0.
export type MonthChange = {
  current: number;
  previous: number;
  change: number | null;
};

export type MonthComparison = { income: MonthChange; expense: MonthChange };

function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 100);
}

export function monthComparison(transactions: TxLike[], now = new Date()): MonthComparison {
  const cur = monthTotals(transactions, now.getFullYear(), now.getMonth());
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prev = monthTotals(transactions, prevDate.getFullYear(), prevDate.getMonth());
  return {
    income: { current: cur.income, previous: prev.income, change: pctChange(cur.income, prev.income) },
    expense: { current: cur.expense, previous: prev.expense, change: pctChange(cur.expense, prev.expense) },
  };
}

// 5. Top N khoản chi lớn nhất (mặc định 5). Nhận vào danh sách giao dịch đã lọc sẵn.
export function topExpenses(transactions: TxLike[], n = 5): TxLike[] {
  return transactions
    .filter((tx) => tx.type === "EXPENSE")
    .sort((a, b) => b.amount - a.amount)
    .slice(0, n);
}

// 6. Streak ghi chép: số ngày liên tiếp (tính tới hôm nay, hoặc hôm qua nếu hôm nay chưa ghi).
export function loggingStreak(transactions: TxLike[], now = new Date()): number {
  const days = new Set(transactions.map((tx) => dayKey(toDate(tx.date))));
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

// 7. Gợi ý tiết kiệm: danh mục chi nhiều nhất tháng này + gợi ý cắt 10% của nó.
export type SavingsSuggestion = {
  category: string;
  amount: number;
  suggestedCut: number;
} | null;

export function savingsSuggestion(transactions: TxLike[], now = new Date()): SavingsSuggestion {
  const totals = new Map<string, number>();
  for (const tx of transactions) {
    const d = toDate(tx.date);
    if (tx.type !== "EXPENSE") continue;
    if (d.getFullYear() !== now.getFullYear() || d.getMonth() !== now.getMonth()) continue;
    totals.set(tx.category, (totals.get(tx.category) ?? 0) + tx.amount);
  }
  if (totals.size === 0) return null;
  const [category, amount] = [...totals.entries()].sort((a, b) => b[1] - a[1])[0];
  return { category, amount, suggestedCut: Math.round(amount * 0.1) };
}

// 10. Hỗ trợ wishlist có deadline: còn bao nhiêu ngày và cần tiết kiệm bao nhiêu/ngày.
export function wishlistDailySaving(
  balance: number,
  cost: number,
  targetDate: Date | string | null,
  now = new Date()
): { daysLeft: number | null; dailyNeeded: number | null; reachable: boolean } {
  if (!targetDate) return { daysLeft: null, dailyNeeded: null, reachable: true };
  const target = toDate(targetDate);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const daysLeft = Math.round((targetDay.getTime() - today.getTime()) / 86400000);
  const remaining = Math.max(0, cost - balance);
  if (remaining === 0) return { daysLeft, dailyNeeded: 0, reachable: true };
  if (daysLeft <= 0) return { daysLeft, dailyNeeded: null, reachable: false };
  return { daysLeft, dailyNeeded: Math.ceil(remaining / daysLeft), reachable: true };
}
