import { prisma } from "@/src/lib/prisma";
export default async function Home() {
  const user = await prisma.user.findUnique({
    where: { email: "demo@finance.local" },
  });
  if (!user) return <main>pay me 100$ to look user</main>;

  const transactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });
  const wishlist = await prisma.wishlistItem.findMany({
    where: { userId: user.id },
  });

  const income = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((s, t) => s + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  return (
    <main>
      <h1>Finance Planner</h1>
      <p>Số dư: {balance.toLocaleString("vi-VN")} đ</p>
      <p>Tổng thu: {income.toLocaleString("vi-VN")} đ</p>
      <p>Tổng chi: {expense.toLocaleString("vi-VN")} đ</p>
      <h2>Giao dịch</h2>
      <ul>
        {transactions.map((t) => (
          <li key={t.id}>
            {t.date.toLocaleDateString("vi-VN")} — {t.description} —{" "}
            {t.type === "INCOME" ? "+" : "-"}
            {t.amount.toLocaleString("vi-VN")} đ ({t.category})
          </li>
        ))}
      </ul>
      <h2>Wishlist</h2>
      <ul>
        {wishlist.map((w) => (
          <li key={w.id}>
            {w.name} — {w.cost.toLocaleString("vi-VN")} đ —{" "}
            {Math.min(100, Math.max(0, Math.round((balance / w.cost) * 100)))}%
          </li>
        ))}
      </ul>
    </main>
  );
}
