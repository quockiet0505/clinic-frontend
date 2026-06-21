# 🚀 Setup Guide - Patient Web

Hướng dẫn cài đặt và chạy môi trường phát triển cho giao diện Web dành cho bệnh nhân.

## Yêu cầu hệ thống
- Node.js >= 18.x
- npm >= 9.x hoặc pnpm/yarn

## Các bước cài đặt

1. **Clone dự án & Di chuyển vào thư mục:**
   ```bash
   cd core_code/clinic-frontend/patient-web
   ```

2. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

3. **Cấu hình môi trường:**
   - Tạo file `.env` dựa trên file mẫu (nếu có).
   - Đảm bảo biến `VITE_API_URL` trỏ tới hệ thống backend.

4. **Khởi chạy Development Server:**
   ```bash
   npm run dev
   ```
   Server mặc định chạy tại `http://localhost:5173`. Trình duyệt sẽ tự động tải lại khi có thay đổi trong code.

## Các lệnh thường dùng
- `npm run dev`: Chạy server dev local.
- `npm run build`: Đóng gói ứng dụng để deploy.
- `npm run lint`: Chạy trình kiểm tra lỗi cú pháp.
