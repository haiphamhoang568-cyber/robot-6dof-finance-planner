"use client";

import { usePathname, useRouter } from "next/navigation";
import { Category } from "../generated/prisma/enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

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
      <Select value={month} onValueChange={(v) => update("month", v ?? "all")}>
        <SelectTrigger className="w-40 rounded-full border-slate-700 bg-slate-900/80 text-slate-200 shadow-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả tháng</SelectItem>
          <SelectItem value="this">Tháng này</SelectItem>
          <SelectItem value="last">Tháng trước</SelectItem>
        </SelectContent>
      </Select>

      <Select value={type} onValueChange={(v) => update("type", v ?? "all")}>
        <SelectTrigger className="w-32 rounded-full border-slate-700 bg-slate-900/80 text-slate-200 shadow-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Thu + Chi</SelectItem>
          <SelectItem value="INCOME">Thu</SelectItem>
          <SelectItem value="EXPENSE">Chi</SelectItem>
        </SelectContent>
      </Select>

      <Select value={category} onValueChange={(v) => update("category", v ?? "all")}>
        <SelectTrigger className="w-48 rounded-full border-slate-700 bg-slate-900/80 text-slate-200 shadow-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả danh mục</SelectItem>
          {Object.values(Category).map((c) => (
            <SelectItem key={c} value={c}>{c.replaceAll("_", " ")}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
