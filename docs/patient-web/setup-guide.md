# Hướng dẫn cài đặt Patient Web

## Yêu cầu môi trường

- Node.js 18+
- npm hoặc pnpm
- Backend clinic chạy sẵn (mặc định `http://localhost:8080`)

## Các bước chạy dự án

1. **Cài đặt thư viện**

   ```bash
   cd patient-web
   pnpm install
   # hoặc: npm install
   ```

2. **Cấu hình biến môi trường**

   Tạo/chỉnh file `.env`:

   ```env
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   VITE_STATIC_BASE_URL=http://localhost:8080
   ```

   - `VITE_API_BASE_URL`: REST API backend.
   - `VITE_STATIC_BASE_URL`: domain phục vụ logo, avatar, file tĩnh (dùng trong PDF và `<Logo />`).

3. **Chạy dev**

   ```bash
   pnpm dev
   # hoặc: npm run dev
   ```

   Truy cập URL hiển thị trên terminal (thường `http://localhost:5173` hoặc `5174`).

## Thư viện liên quan PDF

Đã có trong `package.json`:

- `html2canvas` — chụp layout HTML thành canvas
- `jspdf` — xuất file PDF

Không cần cài thêm nếu đã `pnpm install`.

## Backend cần đồng bộ (hồ sơ sức khoẻ)

Để trang **Hồ sơ sức khoẻ** và PDF hiển thị đủ chỉ số, backend cần có cột trong `patient_vital_profile`:

- `weight`, `blood_pressure`, `pulse`

Nếu DB cũ chưa có, chạy migration:

```bash
# Trong thư mục clinic-backend/database/migrations/
mysql -u ... -p clinic_db < add_patient_vital_profile_metrics.sql
```

## Kiểm tra nhanh sau khi chạy

1. Đăng nhập bệnh nhân → **Hồ sơ sức khoẻ** → cập nhật chiều cao, cân nặng, nhóm máu...
2. **Đơn thuốc** / **Kết quả XN** → bấm **Tải PDF** → toast "Tải PDF thành công", file mở được.
3. Logo phòng khám hiển thị trên header PDF (cần backend serve `/images/logos/logo.png`).
