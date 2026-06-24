# 🌐 Hệ thống Patient Web

Tài liệu này bao quát các thông tin tổng quan, công nghệ và tiêu chuẩn dành cho dự án Patient Web.
Đây là Single Page Application (SPA) xây dựng dựa trên React 18, được tối ưu tốc độ bằng Vite.

## 💡 Ngăn xếp Công nghệ (Tech Stack)
- **Core:** React 18 (Functional Components, Hooks).
- **Ngôn ngữ:** TypeScript (Strict Mode).
- **Bundler:** Vite (Hỗ trợ Hot Module Replacement cực nhanh).
- **Routing:** React Router DOM v6 (hỗ trợ Data Routers).
- **Styling:** Tailwind CSS v3 kết hợp với Shadcn UI (Radix Primitives).
- **State Management:** React Query (cho API State), Context API (cho Global State cục bộ).
- **Form & Validation:** React Hook Form + Zod.

## 📅 Đặt lịch khám (Patient Web)

| Entry | URL | `bookingMode` |
|-------|-----|---------------|
| Theo bác sĩ | `/appointments/book?doctorId=` | `DOCTOR` |
| Theo chuyên khoa | `/appointments/book?expertiseId=` | `EXPERTISE` |
| Theo dịch vụ | `/appointments/book?serviceId=&mode=service` | `SERVICE` |
| Từ AI (gợi ý khoa) | `?expertiseId=&suggestedExpertiseId=&isAiSuggested=1` | `EXPERTISE` |

- **Slot động:** Sử dụng API `GET /appointments/slots?date=&doctorId|expertiseId|serviceId=` để lấy danh sách khung giờ trống (đã loại trừ lịch nghỉ lễ, lịch nghỉ phép của bác sĩ và các lịch đã đặt).
- **Tạo lịch:** `POST /appointments` truyền các trường `bookingMode`, `suggestedExpertiseId`, `isAiSuggested`.
- **UI/UX:**
  - Hiển thị Badge **"✨ AI Gợi ý"** trên form đặt lịch nếu bệnh nhân đi từ luồng Chatbot.
  - Trong lịch sử khám (`AppointmentCard`), phân biệt hiển thị: nếu là `SERVICE` sẽ hiển thị icon dịch vụ thay vì avatar bác sĩ.

## 🤖 AI Chatbot

- Config: `VITE_AI_CHAT_URL` (`src/config/aiChat.ts`)
- API: `src/features/chatbot/api/chatbotApi.ts` — gửi `access_token` từ `localStorage.token` khi đã đăng nhập

Chi tiết: repo `clinic-ai-chat/docs/integration-guide.md`

## 🏥 Hồ sơ y tế & Đánh giá (Patient Web)

- **Chi tiết hồ sơ (`RecordDetail`)**: Tích hợp tính năng xuất PDF toàn bộ bệnh án (chẩn đoán, đơn thuốc, xét nghiệm, chi phí) bằng một nút duy nhất.
- **Đơn thuốc & Xét nghiệm**: Giao diện thẻ (card) hiển thị trạng thái, loại dịch vụ, liên kết trực tiếp đến chi tiết bệnh án gốc.
- **Đánh giá dịch vụ (`MyReviews`)**: Quản lý đánh giá bác sĩ và phòng khám, hiển thị phản hồi từ ban quản trị. Tên bác sĩ được chuẩn hóa tự động qua `formatDoctorName`.
