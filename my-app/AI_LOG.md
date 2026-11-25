# Nhật ký sử dụng AI — Phạm Hoàng Hải

**Dự án:** Finance Planner — Quản lý thu chi Robot 6DOF  
**Công cụ AI:** ChatGPT  
**Ngày thực hiện:** 25/11/2026

| Việc thực hiện                            | ChatGPT hỗ trợ                                                                                                               | Cách kiểm tra                                                                                                                                                                                              |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Chạy ứng dụng và kết nối Neon             | Giải thích lỗi PowerShell và Prisma, hướng dẫn cài dependencies, kiểm tra migration và đối chiếu database với Prisma schema. | Tôi chạy các lệnh trên máy, áp dụng migration và đồng bộ schema. Sau đó tôi mở được dashboard tại `localhost:3000`.                                                                                        |
| Cá nhân hóa màn hình đăng nhập và đăng ký | Từ component `AuthCard` có sẵn, chỉnh tên, tông xanh cyan và hình robot, dùng lại luồng xác thực hiện có.                    | Tôi chép bản sửa vào project và xác nhận giao diện mới xuất hiện trong Chrome.                                                                                                                             |
| Đổi dashboard sang chủ đề robot 6DOF      | Chỉnh bố cục, hình tay robot, nhãn hạng mục, form và biểu đồ. Các nhãn robot sử dụng mã hạng mục cũ.                         | ChatGPT chạy kiểm tra TypeScript, 43 kiểm thử có sẵn, build production và thử ghi, sửa, xóa, lọc giao dịch cùng các form trên PostgreSQL riêng. Tôi mở bản đã chép trên máy và kiểm tra giao diện thực tế. |
| Xử lý cảnh báo hydration                  | Đọc diff HTML và xác định thuộc tính con trỏ được tiện ích Chrome chèn vào.                                                  | Tôi tắt tiện ích đổi con trỏ và tải lại trang.                                                                                                                                                             |

Trên mã nền Finance Planner, phần tôi trực tiếp thực hiện gồm xác định chủ đề Robot 6DOF, thay và kiểm tra các file đã chỉnh, cấu hình Neon, chạy lệnh trên máy và xác nhận giao diện. ChatGPT hỗ trợ viết mã giao diện, chẩn đoán lỗi, kiểm thử trên môi trường riêng và soạn tài liệu.
