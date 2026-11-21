import { describe, it, expect } from "vitest";
import {
  financialHealthScore,
  forecastEndOfMonth,
  whatIfSavings,
  monthComparison,
  topExpenses,
  loggingStreak,
  savingsSuggestion,
  wishlistDailySaving,
} from "./insights";

const NOW = new Date(2026, 10, 21);

const tx = [
  { date: "2026-11-01", type: "INCOME" as const, category: "SALARY", amount: 10000000 },
  { date: "2026-11-05", type: "EXPENSE" as const, category: "FOOD", amount: 400000, description: "Ăn trưa" },
  { date: "2026-11-06", type: "EXPENSE" as const, category: "FOOD", amount: 100000, description: "Cafe" },
  { date: "2026-11-10", type: "EXPENSE" as const, category: "TRANSPORT", amount: 200000, description: "Xăng" },
  { date: "2026-10-05", type: "INCOME" as const, category: "SALARY", amount: 9000000 },
  { date: "2026-10-10", type: "EXPENSE" as const, category: "FOOD", amount: 800000, description: "Ăn uống" },
];

describe("financialHealthScore", () => {
  it("tiết kiệm 93% + streak 15 ngày thì điểm cao", () => {
    const h = financialHealthScore(tx, 15, NOW);
    expect(h.savingsRate).toBe(93);
    expect(h.score).toBe(Math.round(0.6 * 93 + 0.4 * 50));
    expect(h.label).toBe("Tốt");
  });

  it("không có thu nhập thì tỉ lệ tiết kiệm bằng 0", () => {
    const h = financialHealthScore([], 0, NOW);
    expect(h.savingsRate).toBe(0);
    expect(h.score).toBe(0);
    expect(h.label).toBe("Cần cải thiện");
  });
});

describe("forecastEndOfMonth", () => {
  it("dự báo số dư cuối tháng theo tốc độ chi", () => {
    const f = forecastEndOfMonth(tx, 9300000, NOW);
    expect(f.daysRemaining).toBe(9);
    expect(f.dailyExpenseRate).toBe(Math.round(700000 / 21));
    expect(f.projectedBalance).toBe(9300000 - f.dailyExpenseRate * 9);
    expect(f.willBeNegative).toBe(false);
  });

  it("cảnh báo khi dự báo âm", () => {
    const f = forecastEndOfMonth(tx, 100000, NOW);
    expect(f.willBeNegative).toBe(true);
  });
});

describe("whatIfSavings", () => {
  it("cắt 200k/tháng thì 1 năm tiết kiệm 2.4tr", () => {
    expect(whatIfSavings(200000)).toEqual({ m3: 600000, m6: 1200000, m12: 2400000 });
  });

  it("số âm kẹp về 0", () => {
    expect(whatIfSavings(-5000)).toEqual({ m3: 0, m6: 0, m12: 0 });
  });
});

describe("monthComparison", () => {
  it("thu tăng, chi giảm so với tháng trước", () => {
    const c = monthComparison(tx, NOW);
    expect(c.income.change).toBe(11);
    expect(c.expense.change).toBe(-12);
  });

  it("tháng trước bằng 0 thì change là null", () => {
    const c = monthComparison(tx, new Date(2026, 9, 15));
    expect(c.income.change).toBeNull();
  });
});

describe("topExpenses", () => {
  it("trả về 5 khoản chi lớn nhất, giảm dần", () => {
    const top = topExpenses(tx, 2);
    expect(top.map((t) => t.amount)).toEqual([800000, 400000]);
  });
});

describe("loggingStreak", () => {
  it("đếm chuỗi ngày liên tiếp", () => {
    const days = [
      { date: "2026-11-21", type: "EXPENSE" as const, category: "FOOD", amount: 1000 },
      { date: "2026-11-20", type: "EXPENSE" as const, category: "FOOD", amount: 1000 },
      { date: "2026-11-19", type: "EXPENSE" as const, category: "FOOD", amount: 1000 },
      { date: "2026-11-17", type: "EXPENSE" as const, category: "FOOD", amount: 1000 },
    ];
    expect(loggingStreak(days, NOW)).toBe(3);
  });

  it("hôm nay chưa ghi thì tính tới hôm qua", () => {
    const days = [
      { date: "2026-11-20", type: "EXPENSE" as const, category: "FOOD", amount: 1000 },
      { date: "2026-11-19", type: "EXPENSE" as const, category: "FOOD", amount: 1000 },
    ];
    expect(loggingStreak(days, NOW)).toBe(2);
  });

  it("không có giao dịch thì streak 0", () => {
    expect(loggingStreak([], NOW)).toBe(0);
  });
});

describe("savingsSuggestion", () => {
  it("chỉ ra danh mục chi nhiều nhất và gợi ý cắt 10%", () => {
    const s = savingsSuggestion(tx, NOW);
    expect(s).toEqual({ category: "FOOD", amount: 500000, suggestedCut: 50000 });
  });

  it("không có chi thì null", () => {
    expect(savingsSuggestion([], NOW)).toBeNull();
  });
});

describe("wishlistDailySaving", () => {
  it("còn 10 ngày, thiếu 1tr thì cần 100k/ngày", () => {
    const r = wishlistDailySaving(0, 1000000, "2026-12-01", NOW);
    expect(r.daysLeft).toBe(10);
    expect(r.dailyNeeded).toBe(100000);
    expect(r.reachable).toBe(true);
  });

  it("đã đủ tiền thì cần 0/ngày", () => {
    const r = wishlistDailySaving(1000000, 1000000, "2026-12-01", NOW);
    expect(r.dailyNeeded).toBe(0);
    expect(r.reachable).toBe(true);
  });

  it("quá hạn mà chưa đủ tiền thì không kịp", () => {
    const r = wishlistDailySaving(0, 1000000, "2026-11-01", NOW);
    expect(r.reachable).toBe(false);
    expect(r.dailyNeeded).toBeNull();
  });

  it("không có deadline thì null", () => {
    const r = wishlistDailySaving(0, 1000000, null, NOW);
    expect(r.daysLeft).toBeNull();
    expect(r.dailyNeeded).toBeNull();
  });
});
