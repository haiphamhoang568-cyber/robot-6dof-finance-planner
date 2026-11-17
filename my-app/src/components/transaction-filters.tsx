"use client";

import { usePathname, useRouter } from "next/navigation";
import { Category } from "../generated/prisma/enums";

export default function TransactionFilters({
  month,
  category,
  type,
}: {
  month: string;
  category: string;
  type: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  function update(key: "month" | "category" | "type", value: string) {
    const next = { month, category, type, [key]: value };
    const params = new URLSearchParams();
    if (next.month !== "all") params.set("month", next.month);
    if (next.category !== "all") params.set("category", next.category);
    if (next.type !== "all") params.set("type", next.type);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <select value={month} onChange={(e) => update("month", e.target.value)} className="rounded border p-2">
        <option value="all">Tất cả tháng</option>
        <option value="this">Tháng này</option>
        <option value="last">Tháng trước</option>
      </select>

      <select value={type} onChange={(e) => update("type", e.target.value)} className="rounded border p-2">
        <option value="all">Thu + Chi</option>
        <option value="INCOME">Thu</option>
        <option value="EXPENSE">Chi</option>
      </select>

      <select value={category} onChange={(e) => update("category", e.target.value)} className="rounded border p-2">
        <option value="all">Tất cả danh mục</option>
        {Object.values(Category).map((c) => (
          <option key={c} value={c}>{c.replaceAll("_", " ")}</option>
        ))}
      </select>
    </div>
  );
}