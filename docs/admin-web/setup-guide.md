# Hướng dẫn cài đặt Admin Web

## Yêu cầu môi trường
- Node.js 18+
- npm hoặc yarn

## Các bước chạy dự án

1. **Cài đặt thư viện**:
   - Mở terminal tại thư mục `admin-web`.
   - Chạy lệnh:
     ```bash
     npm install
     ```

2. **Cấu hình biến môi trường**:
   - Copy file `.env.example` thành `.env` (nếu dự án có sẵn).
   - Đảm bảo biến `VITE_API_BASE_URL` trỏ đúng về backend. Ví dụ:
     ```env
     VITE_API_BASE_URL=http://localhost:8080/api/v1
     ```

3. **Chạy dự án**:
   - Chạy lệnh khởi động môi trường dev:
     ```bash
     npm run dev
     ```
   - Truy cập vào link hiển thị trên terminal (thường là `http://localhost:5173`).
