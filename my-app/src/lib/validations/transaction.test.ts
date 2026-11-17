import { describe, it, expect } from "vitest";
import { transactionSchema } from "./transaction";

const valid = {
  amount: 400000,
  description: "Ăn trưa",
  type: "INCOME",
  category: "FOOD",
  date: "2026-11-17",
};

describe("transactionSchema", () => {
  it("chấp nhận giao dịch hợp lệ", () => {
    const result = transactionSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.amount).toBe(400000);
      expect(result.data.date).toBeInstanceOf(Date);
    }
  });

  it("từ chối số tiền âm", () => {
    expect(transactionSchema.safeParse({ ...valid, amount: -1000 }).success).toBe(false);
  });

  it("từ chối số tiền bằng 0", () => {
    expect(transactionSchema.safeParse({ ...valid, amount: 0 }).success).toBe(false);
  });

  it("từ chối số tiền không phải số nguyên", () => {
    expect(transactionSchema.safeParse({ ...valid, amount: 100.5 }).success).toBe(false);
  });

  it("từ chối mô tả trống", () => {
    expect(transactionSchema.safeParse({ ...valid, description: "   " }).success).toBe(false);
  });

  it("từ chối mô tả quá 120 ký tự", () => {
    expect(transactionSchema.safeParse({ ...valid, description: "a".repeat(121) }).success).toBe(false);
  });

  it("từ chối loại giao dịch không hợp lệ", () => {
    expect(transactionSchema.safeParse({ ...valid, type: "GIFT" }).success).toBe(false);
  });

  it("từ chối danh mục không hợp lệ", () => {
    expect(transactionSchema.safeParse({ ...valid, category: "TRAVEL" }).success).toBe(false);
  });
});
