import { describe, it, expect } from "vitest";
import { monthlyTotals, expenseByCategory } from "./charts";

const tx = [
  { date: "2026-11-05", type: "INCOME" as const, category: "SALARY", amount: 10000000 },
  { date: "2026-11-10", type: "EXPENSE" as const, category: "FOOD", amount: 400000 },
  { date: "2026-11-12", type: "EXPENSE" as const, category: "FOOD", amount: 100000 },
  { date: "2026-10-20", type: "EXPENSE" as const, category: "TRANSPORT", amount: 200000 },
  { date: "2026-10-01", type: "INCOME" as const, category: "SALARY", amount: 9000000 },
  { date: "2026-05-01", type: "EXPENSE" as const, category: "BILLS", amount: 999999 },
];

describe("monthlyTotals", () => {
  it("gộp đúng thu/chi theo tháng, tháng cũ tới mới", () => {
    const now = new Date(2026, 10, 21);
    const result = monthlyTotals(tx, 2, now);
    expect(result).toEqual([
      { month: "10/2026", income: 9000000, expense: 200000 },
      { month: "11/2026", income: 10000000, expense: 500000 },
    ]);
  });

  it("tháng không có giao dịch thì 0", () => {
    const now = new Date(2026, 10, 21);
    const result = monthlyTotals([], 2, now);
    expect(result).toEqual([
      { month: "10/2026", income: 0, expense: 0 },
      { month: "11/2026", income: 0, expense: 0 },
    ]);
  });

  it("bỏ qua giao dịch ngoài khoảng tháng", () => {
    const now = new Date(2026, 10, 21);
    const result = monthlyTotals(tx, 2, now);
    const total = result.reduce((s, m) => s + m.income + m.expense, 0);
    expect(total).toBe(10000000 + 500000 + 9000000 + 200000);
  });
});

describe("expenseByCategory", () => {
  it("gộp chi theo danh mục, sắp xếp giảm dần", () => {
    const result = expenseByCategory(tx);
    expect(result).toEqual([
      { category: "BILLS", total: 999999 },
      { category: "FOOD", total: 500000 },
      { category: "TRANSPORT", total: 200000 },
    ]);
  });

  it("bỏ qua giao dịch thu", () => {
    const result = expenseByCategory([
      { date: "2026-11-01", type: "INCOME" as const, category: "SALARY", amount: 5000000 },
    ]);
    expect(result).toEqual([]);
  });

  it("không có chi thì rỗng", () => {
    expect(expenseByCategory([])).toEqual([]);
  });
});
