# Hướng Dẫn Dành Cho Lập Trình Viên (Patient Web)

## 1. Cấu trúc thư mục (Feature-based)
Dự án sử dụng kiến trúc **Feature-Sliced Design**.
- `src/features/*`: Chứa các module nghiệp vụ độc lập (vd: `appointments`, `chatbot`, `records`, `auth`).
- Mỗi feature sẽ có các thư mục con: `api/`, `components/`, `pages/`, `types/`, `hooks/`.

## 2. Quản lý Trạng thái (State Management)
- **Server State:** Bắt buộc sử dụng `React Query` (TanStack Query) cho mọi tác vụ gọi API (`useQuery`, `useMutation`).
- **Global State:** Sử dụng `Zustand` (cho giỏ hàng dịch vụ, phiên đăng nhập).
- **Local State:** Sử dụng `useState` nội bộ trong Component.

## 3. Tích hợp AI Chatbot
- Chatbot gọi API qua `chatbotApi.ts`. Token xác thực được lấy từ `localStorage` và tự động nhúng vào payload request qua AI Server.

## 4. Quy chuẩn Code (Coding Conventions)
- **API:** Mọi HTTP Request phải gọi qua `axiosClient` đã được cấu hình sẵn Interceptor để đính kèm Token.
- **Routing:** Khai báo tại `src/routes`. Tách biệt các Route yêu cầu đăng nhập.

*Tài liệu này đã được cô đọng. Các hướng dẫn cũ (api.md, state.md...) đã được loại bỏ để tránh rườm rà.*
