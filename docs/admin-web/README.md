# 🌐 Hệ thống Admin Web

Tài liệu này bao quát các thông tin tổng quan, công nghệ và tiêu chuẩn dành cho dự án Admin Web.
Đây là Single Page Application (SPA) xây dựng dựa trên React 18, được tối ưu tốc độ bằng Vite.

## 💡 Ngăn xếp Công nghệ (Tech Stack)
- **Core:** React 18 (Functional Components, Hooks).
- **Ngôn ngữ:** TypeScript (Strict Mode).
- **Bundler:** Vite (Hỗ trợ Hot Module Replacement cực nhanh).
- **Routing:** React Router DOM v6 (hỗ trợ Data Routers).
- **Styling:** Tailwind CSS v3 kết hợp với Shadcn UI (Radix Primitives).
- **State Management:** React Query (cho API State), Context API (cho Global State cục bộ).
- **Form & Validation:** React Hook Form + Zod.

## 📋 Quản lý lịch hẹn

Bảng lịch (`AppointmentTable`) hiển thị thêm:

| Field | Ý nghĩa |
|-------|---------|
| `bookingMode` | DOCTOR / EXPERTISE / SERVICE / DIRECT |
| `isAiSuggested` | Badge "AI gợi ý" |
| `expertiseName` | Chuyên khoa bệnh nhân chọn |
| `suggestedExpertiseName` | Chuyên khoa AI gợi ý (nếu khác khoa chọn) |

API backend trả đủ field qua `AppointmentResponse`.

## 🧾 Trang chi tiết chuẩn (Detail Pages)

Tất cả trang chi tiết của admin-web dùng chung 2 component:

- `components/common/DetailPageHeader` — header thống nhất gồm: nút quay lại + tiêu đề + mã code badge + status badge + vùng action. Đi kèm 2 helper `IconAction` (icon 36×36) và `ActionButton` (icon + text), **hỗ trợ 7 tone màu**: `default` (slate), `primary` (blue solid), `sky`, `emerald`, `violet`, `amber`, `rose`. Quy ước màu chuẩn:
  - **`sky`** cho In phiếu (Print)
  - **`emerald`** cho Tải PDF / Chỉnh sửa thành công
  - **`primary`** cho action chính (Lưu, Hoàn tất)
  - **`rose`** cho Hủy / nguy hiểm
  - **`violet`** / **`amber`** cho phụ trợ.
- `features/medical/components/PatientSummaryBanner` — banner thông tin bệnh nhân gọn (avatar + tên + giới/tuổi + mã hồ sơ + SĐT + ngày khám), tùy chọn hiển thị sinh hiệu nhanh ở vế phải. Dùng chung cho Triage và Consultation.

Các trang đã chuẩn hóa:

| Trang | Đặc điểm |
|-------|----------|
| `TriageWorkspace` (Đo sinh hiệu) | Header + Patient banner + card form sinh hiệu (đã fix lỗi clip content) |
| `ConsultationWorkspace` (Đang khám) | Header + Patient banner (kèm sinh hiệu) + tabs Phiếu khám/Kê đơn full-width |
| `MedicalRecordDetail` (Chi tiết bệnh án) | Header + icon In (sky)/PDF (emerald), bỏ card "Xuất hồ sơ" sidebar |
| `LabResultDetail` (Chi tiết KQ xét nghiệm) | Layout 2 cột **sidebar gradient blue + paper-sheet**, section icon màu, box kết luận accent emerald |
| `PrescriptionDetail` (Chi tiết đơn thuốc) | Layout 2 cột **sidebar gradient emerald + paper-sheet**, vital cards 4 màu, bảng thuốc header gradient |
| `PatientDetails` (Hồ sơ bệnh nhân) | Sidebar profile card + 6 health cards 6 màu + cảnh báo dị ứng accent amber + timeline lịch sử khám |

Quy tắc đặt nút action:

- **Nút icon-only (`IconAction`)** chỉ chứa thao tác phụ trợ (In, Tải PDF, Share). Có `title` + `aria-label` cho a11y.
- **Nút có text (`ActionButton`)** cho action chính của trang (Lưu, Hoàn tất). Có thể đặt `variant="primary"`.
- Status badge nằm cạnh title (không nằm trong vùng action) để dễ scan.
