import { describe, it, expect } from "vitest";
import { savingsMilestone } from "./savings";

describe("savingsMilestone", () => {
  it("đủ một nửa mục tiêu thì 50%", () => {
    const m = savingsMilestone(500000, 1000000);
    expect(m.percent).toBe(50);
    expect(m.reached).toBe(false);
    expect(m.remaining).toBe(500000);
  });

  it("đủ đúng mục tiêu thì 100% và đã đạt", () => {
    const m = savingsMilestone(1000000, 1000000);
    expect(m.percent).toBe(100);
    expect(m.reached).toBe(true);
    expect(m.remaining).toBe(0);
  });

  it("vượt mục tiêu thì kẹp ở 100% và còn thiếu 0", () => {
    const m = savingsMilestone(1500000, 1000000);
    expect(m.percent).toBe(100);
    expect(m.reached).toBe(true);
    expect(m.remaining).toBe(0);
  });

  it("chưa có đồng nào thì 0%", () => {
    const m = savingsMilestone(0, 1000000);
    expect(m.percent).toBe(0);
    expect(m.reached).toBe(false);
    expect(m.remaining).toBe(1000000);
  });

  it("mục tiêu bằng 0 coi như đã đạt", () => {
    const m = savingsMilestone(0, 0);
    expect(m.percent).toBe(100);
    expect(m.reached).toBe(true);
    expect(m.remaining).toBe(0);
  });

  it("số tiền âm được kẹp về 0", () => {
    const m = savingsMilestone(-5000, 1000000);
    expect(m.saved).toBe(0);
    expect(m.percent).toBe(0);
    expect(m.remaining).toBe(1000000);
  });

  it("làm tròn phần trăm (1/3 thành 33%)", () => {
    const m = savingsMilestone(1, 3);
    expect(m.percent).toBe(33);
    expect(m.reached).toBe(false);
    expect(m.remaining).toBe(2);
  });

  it("số lẻ VND được làm tròn xuống số nguyên", () => {
    const m = savingsMilestone(1000.9, 2000.9);
    expect(m.saved).toBe(1000);
    expect(m.target).toBe(2000);
    expect(m.percent).toBe(50);
  });
});
