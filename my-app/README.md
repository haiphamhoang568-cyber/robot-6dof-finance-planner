# Quản lý thu chi Robot 6DOF

**Bản tùy chỉnh của Phạm Hoàng Hải.** Ứng dụng dùng để theo dõi quỹ dự án, chi phí chế tạo và kế hoạch mua linh kiện cho robot 6DOF.

## Các chức năng

- Đăng ký và đăng nhập bằng email.
- Ghi, sửa, xóa và lọc khoản thu chi của tài khoản đang đăng nhập.
- Xem số dư, tổng thu, tổng chi và biểu đồ theo tháng hoặc theo hạng mục.
- Theo dõi linh kiện dự kiến mua, giá, mức ưu tiên và ngày mục tiêu.
- Đặt hạn mức chi theo hạng mục và lập lịch thu chi định kỳ.
- Xem dự báo quỹ và ước tính tiết kiệm.

## Công nghệ

Next.js, TypeScript, Prisma, PostgreSQL trên Neon, Better Auth và Recharts.

## Chạy trên Windows

Mở Terminal tại thư mục chứa `package.json` của ứng dụng, thường là `my-app`, rồi cài thư viện.

```powershell
npm.cmd ci
```

Tạo `.env` từ `.env.example` của dự án và điền biến môi trường. Gán `DATABASE_URL` bằng URL Neon của mình, `BETTER_AUTH_SECRET` bằng khóa ngẫu nhiên, và `BETTER_AUTH_URL` bằng `http://localhost:3000` khi chạy tại máy. Lưu các giá trị bí mật trong môi trường chạy.

Với database Neon mới dành riêng cho dự án, tạo các bảng từ schema Prisma rồi sinh Prisma Client.

```powershell
npx.cmd prisma db push
npx.cmd prisma generate
```

Khởi động ứng dụng và mở địa chỉ Local hiện trong Terminal.

```powershell
npm.cmd run dev
```

## Kiểm tra

```powershell
npm.cmd test
npm.cmd run build
```

## Nguồn mã và phần tùy chỉnh

Dự án sử dụng mã nền Finance Planner theo giấy phép MIT trong `LICENSE`.

Bản Phạm Hoàng Hải sử dụng mã nền đó cho luồng xác thực, giao dịch và xử lý dữ liệu. Các thay đổi của bản này gồm giao diện đăng nhập có robot, dashboard Robot 6DOF, nhãn hạng mục cho chế tạo robot, bố cục trên điện thoại và cấu hình database Neon để chạy thử. Quá trình dùng ChatGPT được ghi trong `AI_LOG.md`.
