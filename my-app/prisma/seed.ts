import { prisma } from "../src/lib/prisma";
import type { Category, TransactionType } from "../src/generated/prisma/client";

type Row = {
  daysAgo: number;
  type: TransactionType;
  amount: number;
  description: string;
  category: Category;
};

const rows: Row[] = [
  { daysAgo: 40, type: "INCOME", amount: 15000000, description: "Lương tháng 10", category: "SALARY" },
  { daysAgo: 10, type: "INCOME", amount: 15000000, description: "Lương tháng 11", category: "SALARY" },
  { daysAgo: 25, type: "INCOME", amount: 1200000, description: "Bán đồ cũ", category: "INVESTMENT" },
  { daysAgo: 5, type: "INCOME", amount: 800000, description: "Làm thêm cuối tuần", category: "OTHER" },
  { daysAgo: 0, type: "EXPENSE", amount: 45000, description: "Cơm trưa", category: "FOOD" },
  { daysAgo: 1, type: "EXPENSE", amount: 120000, description: "Đi chợ", category: "FOOD" },
  { daysAgo: 2, type: "EXPENSE", amount: 85000, description: "Cơm tối", category: "FOOD" },
  { daysAgo: 4, type: "EXPENSE", amount: 250000, description: "Ăn lẩu với bạn", category: "FOOD" },
  { daysAgo: 7, type: "EXPENSE", amount: 60000, description: "Cà phê sáng", category: "FOOD" },
  { daysAgo: 12, type: "EXPENSE", amount: 95000, description: "Mua đồ ăn vặt", category: "FOOD" },
  { daysAgo: 16, type: "EXPENSE", amount: 90000, description: "Ăn sáng", category: "FOOD" },
  { daysAgo: 26, type: "EXPENSE", amount: 65000, description: "Trà sữa", category: "FOOD" },
  { daysAgo: 1, type: "EXPENSE", amount: 15000, description: "Xe buýt", category: "TRANSPORT" },
  { daysAgo: 3, type: "EXPENSE", amount: 50000, description: "Xăng xe", category: "TRANSPORT" },
  { daysAgo: 8, type: "EXPENSE", amount: 120000, description: "Grab đi học", category: "TRANSPORT" },
  { daysAgo: 20, type: "EXPENSE", amount: 45000, description: "Gửi xe tháng", category: "TRANSPORT" },
  { daysAgo: 6, type: "EXPENSE", amount: 200000, description: "Xem phim", category: "ENTERTAINMENT" },
  { daysAgo: 15, type: "EXPENSE", amount: 150000, description: "Mua game", category: "ENTERTAINMENT" },
  { daysAgo: 28, type: "EXPENSE", amount: 300000, description: "Đi chơi cuối tuần", category: "ENTERTAINMENT" },
  { daysAgo: 2, type: "EXPENSE", amount: 350000, description: "Mua áo", category: "SHOPPING" },
  { daysAgo: 9, type: "EXPENSE", amount: 180000, description: "Mua sách", category: "SHOPPING" },
  { daysAgo: 18, type: "EXPENSE", amount: 500000, description: "Giày thể thao", category: "SHOPPING" },
  { daysAgo: 19, type: "EXPENSE", amount: 110000, description: "Sạc dự phòng", category: "SHOPPING" },
  { daysAgo: 33, type: "EXPENSE", amount: 220000, description: "Mua đồ dùng học tập", category: "SHOPPING" },
  { daysAgo: 5, type: "EXPENSE", amount: 1500000, description: "Tiền trọ tháng 11", category: "BILLS" },
  { daysAgo: 35, type: "EXPENSE", amount: 1500000, description: "Tiền trọ tháng 10", category: "BILLS" },
  { daysAgo: 3, type: "EXPENSE", amount: 350000, description: "Tiền điện", category: "BILLS" },
  { daysAgo: 11, type: "EXPENSE", amount: 200000, description: "Tiền nước + internet", category: "BILLS" },
  { daysAgo: 14, type: "EXPENSE", amount: 100000, description: "Cắt tóc", category: "OTHER" },
  { daysAgo: 22, type: "EXPENSE", amount: 400000, description: "Khám sức khỏe", category: "OTHER" },
  { daysAgo: 30, type: "EXPENSE", amount: 75000, description: "Rửa xe", category: "OTHER" },
];

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@finance.local" },
    update: {},
    create: {
      id: "demo-user-1",
      name: "Demo",
      email: "demo@finance.local",
      emailVerified: true,
    },
  });

  await prisma.transaction.deleteMany({ where: { userId: user.id } });
  await prisma.wishlistItem.deleteMany({ where: { userId: user.id } });

  const now = new Date();
  const day = (daysAgo: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    return d;
  };

  await prisma.transaction.createMany({
    data: rows.map((r) => ({
      userId: user.id,
      type: r.type,
      amount: r.amount,
      description: r.description,
      category: r.category,
      date: day(r.daysAgo),
    })),
  });

  await prisma.wishlistItem.createMany({
    data: [
      { userId: user.id, name: "Laptop mới", cost: 25000000, priority: "HIGH" },
      { userId: user.id, name: "Tai nghe chống ồn", cost: 3500000, priority: "MEDIUM" },
      { userId: user.id, name: "Bàn phím cơ", cost: 1200000, priority: "LOW" },
    ],
  });

  const count = await prisma.transaction.count({ where: { userId: user.id } });
  console.log(`Seed xong: ${count} giao dịch cho ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
