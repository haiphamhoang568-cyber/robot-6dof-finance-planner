export type SavingsMilestone = {
  saved: number;
  target: number;
  percent: number;
  reached: boolean;
  remaining: number;
};

/**
 * Tính tiến độ mốc tiết kiệm (hàm thuần, không đọc DB hay state).
 * saved: số tiền đã có (VND, số nguyên). target: số tiền mục tiêu (VND, số nguyên).
 * percent làm tròn, kẹp trong 0-100. reached khi saved >= target.
 * target <= 0 coi như đã đạt (không còn gì để tiết kiệm).
 */
export function savingsMilestone(saved: number, target: number): SavingsMilestone {
  const safeSaved = Math.max(0, Math.floor(saved));
  const safeTarget = Math.max(0, Math.floor(target));

  if (safeTarget === 0) {
    return { saved: safeSaved, target: 0, percent: 100, reached: true, remaining: 0 };
  }

  const percent = Math.min(100, Math.round((safeSaved / safeTarget) * 100));
  const reached = safeSaved >= safeTarget;
  const remaining = Math.max(0, safeTarget - safeSaved);
  return { saved: safeSaved, target: safeTarget, percent, reached, remaining };
}
