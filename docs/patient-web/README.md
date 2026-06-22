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

- Slot: `GET /appointments/slots?date=&doctorId|expertiseId|serviceId=`
- Tạo lịch: `POST /appointments` với `bookingMode`, `suggestedExpertiseId`, `isAiSuggested`

## 🤖 AI Chatbot

- Config: `VITE_AI_CHAT_URL` (`src/config/aiChat.ts`)
- API: `src/features/chatbot/api/chatbotApi.ts` — gửi `access_token` từ `localStorage.token` khi đã đăng nhập

Chi tiết: repo `clinic-ai-chat/docs/integration-guide.md`
