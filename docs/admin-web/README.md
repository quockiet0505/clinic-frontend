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
