"use client";

import { usePathname, useRouter } from "next/navigation";
import { Category } from "../generated/prisma/enums";
import { ROBOT_TYPE_LABELS, robotCategoryLabel } from "../lib/robot-labels";
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
        <SelectTrigger aria-label="Lọc theo tháng" className="w-full min-[440px]:w-36">
          <SelectValue>{month === "this" ? "Tháng này" : month === "last" ? "Tháng trước" : "Tất cả tháng"}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả tháng</SelectItem>
          <SelectItem value="this">Tháng này</SelectItem>
          <SelectItem value="last">Tháng trước</SelectItem>
        </SelectContent>
      </Select>

      <Select value={type} onValueChange={(v) => update("type", v ?? "all")}>
        <SelectTrigger aria-label="Lọc theo loại" className="w-full min-[440px]:w-36">
          <SelectValue>{type === "INCOME" || type === "EXPENSE" ? ROBOT_TYPE_LABELS[type] : "Thu và chi"}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Thu và chi</SelectItem>
          <SelectItem value="INCOME">{ROBOT_TYPE_LABELS.INCOME}</SelectItem>
          <SelectItem value="EXPENSE">{ROBOT_TYPE_LABELS.EXPENSE}</SelectItem>
        </SelectContent>
      </Select>

      <Select value={category} onValueChange={(v) => update("category", v ?? "all")}>
        <SelectTrigger aria-label="Lọc theo hạng mục" className="w-full min-[440px]:w-49">
          <SelectValue>{category === "all" ? "Tất cả hạng mục" : robotCategoryLabel(category)}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả hạng mục</SelectItem>
          {Object.values(Category).map((c) => (
            <SelectItem key={c} value={c}>{robotCategoryLabel(c)}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
