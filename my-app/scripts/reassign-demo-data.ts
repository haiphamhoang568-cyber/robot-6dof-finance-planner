import { prisma } from "../src/lib/prisma";

try {
  process.loadEnvFile();
} catch {
  // tsx đã load .env rồi thì thôi
}

if (!process.env.DATABASE_URL) {
  console.error("Không thấy DATABASE_URL — kiểm tra file my-app/.env có dòng DATABASE_URL không.");
  process.exit(1);
}
try {
  console.log("Đang kết nối tới DB host: " + new URL(process.env.DATABASE_URL).hostname);
} catch {
  console.log("DATABASE_URL có nhưng đọc host không được.");
}

async function main() {
  const realEmail = process.argv[2];
  if (!realEmail) {
    console.error("Dùng: npx tsx scripts/reassign-demo-data.ts <email-tai-khoan-that>");
    process.exit(1);
  }

  const demo = await prisma.user.findUnique({ where: { email: "demo@finance.local" } });
  if (!demo) {
    console.log("Không tìm thấy demo user (demo@finance.local) — có thể đã xóa rồi.");
    return;
  }

  const real = await prisma.user.findUnique({ where: { email: realEmail } });
  if (!real) {
    console.error("Không tìm thấy tài khoản thật với email " + realEmail + " — đăng ký trước đã.");
    process.exit(1);
  }

  const tx = await prisma.transaction.updateMany({
    where: { userId: demo.id },
    data: { userId: real.id },
  });
  const wl = await prisma.wishlistItem.updateMany({
    where: { userId: demo.id },
    data: { userId: real.id },
  });

  await prisma.user.delete({ where: { id: demo.id } });

  console.log("Đã chuyển " + tx.count + " giao dịch và " + wl.count + " wishlist sang " + realEmail + ", đã xóa demo user.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
