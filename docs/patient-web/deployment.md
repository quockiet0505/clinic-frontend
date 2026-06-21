# 📦 Hướng dẫn Triển khai (Deployment) - Patient Web

Quy trình build và đẩy ứng dụng Vite React SPA (Single Page Application) lên máy chủ thực tế.

## 1. Chuẩn bị Môi trường Production
Tạo file `.env.production`:
```env
VITE_API_BASE_URL=https://api.clinicmanagement.com/v1
VITE_APP_ENV=production
```

## 2. Build dự án
Chạy lệnh đóng gói:
```bash
npm run build
```
Quá trình này Vite sẽ gom (bundle) toàn bộ code TS, React thành file HTML, JS, CSS tĩnh cực kì nhẹ, loại bỏ các thư viện rác (Tree-shaking) và xuất ra thư mục `dist/`.

## 3. Triển khai lên Máy chủ Nginx (Khuyến nghị)
Sau khi đưa thư mục `dist/` lên server Ubuntu/CentOS, cần cấu hình Nginx để phục vụ file tĩnh và bắt buộc Rewrite URL về `index.html` (để React Router hoạt động khi người dùng bấm F5).

```nginx
server {
    listen 80;
    server_name admin.clinicmanagement.com;
    root /var/www/admin-web/dist;
    index index.html;

    location / {
        # Nếu không tìm thấy file, trả về index.html
        try_files $uri $uri/ /index.html;
    }
}
```

## 4. Vercel / Netlify
Nếu sử dụng PaaS như Vercel, chỉ cần kết nối Github, chọn framework là Vite. Các nền tảng này sẽ tự động lo phần rewrite rule cho SPA.
