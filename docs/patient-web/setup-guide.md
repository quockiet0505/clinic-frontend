# 🚀 Hướng dẫn Cài đặt & Khởi chạy (Setup Guide) - Patient Web

## 1. Yêu cầu hệ thống
- **Node.js:** Bắt buộc từ phiên bản `18.17.0` trở lên (Khuyến nghị dùng NVM để quản lý).
- **Trình quản lý gói:** `npm` (tích hợp sẵn) hoặc `pnpm` (nhanh hơn).
- **Trình duyệt:** Chrome/Edge/Firefox bản mới nhất hỗ trợ ES Module.

## 2. Quy trình Cài đặt Môi trường
Mở Terminal và thực hiện các bước sau:

**Bước 1: Clone và truy cập dự án**
```bash
cd core_code/clinic-frontend/patient-web
```

**Bước 2: Cài đặt thư viện (Dependencies)**
Cài đặt chính xác các package có trong `package-lock.json`:
```bash
npm ci  # Clean install - khuyến nghị để tránh sai lệch phiên bản
# Hoặc
npm install
```

**Bước 3: Cấu hình biến môi trường**
Hệ thống sử dụng các biến bảo mật không được push lên Git.
Copy file mẫu:
```bash
cp .env.example .env.local
```
Chỉnh sửa `.env.local` theo cấu hình máy bạn:
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_APP_ENV=development
```

**Bước 4: Khởi chạy Dev Server**
```bash
npm run dev
```
Trình duyệt sẽ tự mở tại `http://localhost:5173`. Tính năng HMR (Hot Module Replacement) đã kích hoạt, bạn sửa code giao diện sẽ tự reload ngay lập tức.
