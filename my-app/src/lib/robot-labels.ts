import type { Category, TransactionType } from "../generated/prisma/enums";

const CATEGORY_LABELS: Record<Category, string> = {
  FOOD: "Động cơ & hộp số",
  TRANSPORT: "Vận chuyển",
  ENTERTAINMENT: "In 3D & gia công",
  SHOPPING: "Driver & điều khiển",
  BILLS: "Nguồn điện & vận hành",
  SALARY: "Đóng góp vào quỹ",
  INVESTMENT: "Cảm biến & encoder",
  OTHER: "Vật tư khác",
};

export function robotCategoryLabel(category: string): string {
  return Object.hasOwn(CATEGORY_LABELS, category)
    ? CATEGORY_LABELS[category as Category]
    : category.replaceAll("_", " ");
}

export const ROBOT_TYPE_LABELS: Record<TransactionType, string> = {
  INCOME: "Thu vào quỹ",
  EXPENSE: "Chi dự án",
};
