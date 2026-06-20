# Cấu trúc thư mục Patient Web

Dự án áp dụng kiến trúc **Feature-Sliced Design** (chia theo tính năng) để code dễ quản lý, dễ bảo trì và phân tách rõ ràng các luồng nghiệp vụ của bệnh nhân.

## Cấu trúc chính (`src/`)

- `assets/`: Hình ảnh, icon tĩnh dùng trong dự án.
- `components/`: Các UI component dùng chung toàn dự án.
  - `common/`: Component tái sử dụng nhiều nơi:
    - Layout/UI: `SectionContainer`, `SearchInput`, `ActionButton`, `Pagination`, `EmptyState`, `ConfirmDialog`...
    - Form: `FormModal` — modal form cấu hình field động (1–2 cột, cuộn, footer tùy chỉnh).
    - PDF: `ClinicPdfLayout` — template PDF chuẩn phòng khám (header, mục I–IV, chữ ký).
  - `ui/`: Component cơ bản (shadcn/ui: `dialog`, `tabs`, `input`, `button`...).
- `config/`: Cấu hình hệ thống (Axios, interceptors...).
- `contexts/`: React Contexts (ví dụ: `AuthContext`).
- `features/`: Module tính năng chính. Mỗi feature có `api`, `components`, `pages`, `types`:
  - `home/`: Trang chủ, danh bạ bác sĩ/dịch vụ, thông báo, FAQ.
  - `appointments/`: Đặt lịch, lịch hẹn, chi tiết lịch, đánh giá (`ReviewModal`).
  - `records/`: Hồ sơ y tế tổng quát, **Hồ sơ sức khoẻ**, đơn thuốc, kết quả XN/CLS.
  - `profile/`: Hồ sơ cá nhân, đổi mật khẩu, lịch sử thanh toán, **lịch sử đánh giá**.
  - `contact/`, `auth/`, `chatbot/`: Liên hệ, đăng nhập/đăng ký, chatbot.
- `hooks/`: Custom hooks (`useToast`...).
- `layouts/`: `MainLayout` (Header + Footer), `AuthLayout`.
- `routes/`: Routing trung tâm (`react-router-dom`).
- `utils/`:
  - `url.ts`, `image.ts`: URL ảnh/static từ backend.
  - `generatePdf.ts`: Tải PDF từ layout ẩn (`html2canvas` + `jspdf`), toast báo kết quả, `formatDoctorName`, `formatVND`.

## Luồng PDF (đơn thuốc / xét nghiệm)

```
Card hoặc Modal
  └─ ClinicPdfLayout (display:none, inline styles)
  └─ generatePdf(elementId, filename)
       └─ clone → append body → html2canvas → jsPDF → save
```

- Layout PDF nằm **cùng card** (id duy nhất theo `prescriptionId` / `resultId`).
- Modal chi tiết gọi lại cùng `elementId` — không duplicate layout.
- Dữ liệu bệnh nhân + hồ sơ sức khoẻ lấy từ `profileApi.getMyProfile()` khi render card.

## Export common components

Import qua barrel file:

```ts
import { FormModal, ClinicPdfLayout, SectionContainer } from '@/components/common';
import { generatePdf, formatDoctorName } from '@/utils/generatePdf';
```
