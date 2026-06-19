# Cấu trúc thư mục Admin Web

Dự án áp dụng kiến trúc **Feature-Sliced Design** (chia theo tính năng) để code dễ quản lý, dễ mở rộng và không bị rối khi dự án lớn lên.

## Cấu trúc chính (`src/`)

- `assets/`: Hình ảnh, icon tĩnh.
- `components/`: Các UI component dùng chung toàn dự án.
  - `common/`: Button, Modal, FormDialog, EntityAvatar, CustomSelect...
  - `tables/`: Component Table dùng chung.
  - `ui/`: Các component cơ bản (thường dùng shadcn/ui).
- `config/`: Cấu hình hệ thống (Axios, cấu hình theme...).
- `features/`: Chứa các module tính năng chính (dashboard, staffs, patients, settings...). Mỗi feature có cấu trúc nội bộ riêng biệt:
  - `api/`: Các hàm gọi API (ví dụ: `staffApi.ts`).
  - `components/`: Component chỉ dùng riêng cho feature này.
  - `pages/`: Các trang giao diện chính của feature.
  - `types/`: Định nghĩa TypeScript interfaces cho feature.
  - `utils/`: Các hàm helper xử lý logic riêng.
- `layouts/`: Các layout bọc ngoài page (ví dụ: `AdminLayout` gồm Sidebar + Header).
- `routes/`: Cấu hình routing bằng `react-router-dom`.
- `utils/`: Các hàm tiện ích dùng chung toàn dự án (format tiền, format ngày tháng, xử lý ảnh...).
