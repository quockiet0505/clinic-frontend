# 📂 Folder Structure - Admin Web

Cấu trúc thư mục được tổ chức theo tính năng (Feature-based) để dễ dàng scale và quản lý.

```text
admin-web/
├── public/                 # File tĩnh (assets, favicon, v.v.)
├── src/
│   ├── assets/             # Hình ảnh, fonts, icons nội bộ
│   ├── components/         # Components dùng chung toàn app (UI, Layouts)
│   ├── config/             # Cấu hình môi trường, constants
│   ├── contexts/           # React Context (Auth, Theme)
│   ├── features/           # Các module chức năng chính
│   │   ├── auth/           # Đăng nhập, phân quyền
│   │   ├── dashboard/      # Thống kê, biểu đồ
│   │   ├── pharmacy/       # Quản lý kho thuốc
│   │   └── ...
│   ├── hooks/              # Custom hooks dùng chung (useDebounce, useAuth...)
│   ├── layouts/            # Các layout bao ngoài (AdminLayout, AuthLayout)
│   ├── pages/              # Khai báo các trang (kết nối với router)
│   ├── routes/             # Cấu hình React Router
│   ├── services/           # Gọi API, cấu hình Axios
│   ├── types/              # Khai báo TypeScript Interfaces chung
│   └── utils/              # Các hàm tiện ích (formatDate, validators)
├── .env                    # Biến môi trường
├── index.html              # Entry HTML
├── package.json            # Quản lý dependencies
├── tsconfig.json           # Cấu hình TypeScript
└── vite.config.ts          # Cấu hình Vite
```

## Giải thích chi tiết `features/`
Mỗi tính năng trong `features/` hoạt động như một module độc lập, bao gồm:
- `components/`: Component dành riêng cho feature này.
- `hooks/`: Hooks nội bộ.
- `api/`: Các hàm gọi API.
- `types/`: Type definitions riêng.
