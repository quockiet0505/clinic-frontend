# 🚀 Setup Guide - Admin Web

Hướng dẫn cài đặt và chạy môi trường phát triển cho dự án Admin Web.

## Yêu cầu hệ thống
- Node.js >= 18.x
- npm >= 9.x hoặc pnpm/yarn

## Các bước cài đặt

1. **Clone dự án & Di chuyển vào thư mục:**
   ```bash
   cd core_code/clinic-frontend/admin-web
   ```

2. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

3. **Cấu hình môi trường:**
   - Copy file `.env.example` thành `.env` (hoặc `.env.local`).
   - Đảm bảo biến `VITE_API_URL` trỏ tới địa chỉ backend đang chạy (ví dụ: `http://localhost:8080/api/v1`).

4. **Khởi chạy Development Server:**
   ```bash
   npm run dev
   ```
   Server sẽ mặc định chạy ở cổng `5173` (hoặc cổng trống tiếp theo). Truy cập trình duyệt tại `http://localhost:5173`.

## Các lệnh thường dùng
- `npm run dev`: Chạy server dev.
- `npm run build`: Đóng gói dự án để deploy lên production.
- `npm run preview`: Chạy thử bản build production local.
- `npm run lint`: Kiểm tra lỗi ESLint/Prettier.
