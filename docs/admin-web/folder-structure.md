# 📂 Kiến trúc Thư mục (Folder Structure)

Dự án Admin Web áp dụng mô hình kiến trúc **Feature-Sliced Design (Biến thể)**. Mô hình này giúp code không bị rối khi dự án lớn lên, vì mọi logic liên quan đến một tính năng được gom lại vào một chỗ.

```text
src/
├── assets/             # Hình ảnh (png, svg), fonts, lotties.
├── components/         # Các thành phần UI dùng chung TOÀN CỤC (Shared).
│   ├── ui/             # Các components cơ bản (Button, Input, Modal - thường từ Shadcn).
│   └── layout/         # Header, Footer, Sidebar, PageContainer.
│
├── config/             # Cấu hình tĩnh: env, router paths, constants.
├── contexts/           # React Context (AuthContext, ThemeContext).
├── hooks/              # Custom hooks dùng chung (useWindowSize, useDebounce).
│
├── features/           # 🌟 TRÁI TIM CỦA DỰ ÁN 🌟 (Feature-based)
│   ├── auth/           # Module Đăng nhập / Phân quyền
│   │   ├── api/        # Các hàm gọi Axios riêng cho Auth
│   │   ├── components/ # Các component chỉ dùng trong Auth (LoginForm)
│   │   ├── hooks/      # Hooks nghiệp vụ (useLogin)
│   │   └── types/      # Định nghĩa Type riêng cho Auth
│   │
│   ├── appointments/   # Module Quản lý Lịch hẹn
│   └── users/          # Module Quản lý Người dùng
│
├── pages/              # Nơi ráp các Feature lại thành 1 trang hoàn chỉnh.
├── routes/             # Cấu hình React Router (Public Route, Private Route).
├── services/           # Cấu hình Axios Client, Interceptors.
├── types/              # Type/Interface dùng chung toàn hệ thống.
└── utils/              # Helper functions (formatCurrency, formatDate).
```

## Giải thích Triết lý: Tại sao lại có thư mục `features/`?
Thay vì nhét mọi Component vào `src/components`, mọi API vào `src/api`, thì `features/` nhóm chúng theo Ngữ cảnh nghiệp vụ. 
Ví dụ: Component `BookingForm` chỉ phục vụ việc Đặt lịch, nó sẽ nằm trong `src/features/appointments/components/BookingForm.tsx`, giúp dev mới vào dự án dễ dàng khoanh vùng để sửa lỗi mà không sợ side-effect.
