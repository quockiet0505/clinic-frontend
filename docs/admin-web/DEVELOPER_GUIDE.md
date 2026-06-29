# Hướng Dẫn Dành Cho Lập Trình Viên (Admin Web)

## 1. Cấu trúc thư mục (Feature-based)
Dự án sử dụng kiến trúc **Feature-Sliced Design**.
- `src/features/*`: Chứa các module nghiệp vụ độc lập (vd: `appointments`, `medical`, `patients`).
- Mỗi feature sẽ có các thư mục con: `api/`, `components/`, `pages/`, `types/`, `hooks/`.

## 2. Quản lý Trạng thái (State Management)
- **Server State:** Bắt buộc sử dụng `React Query` (TanStack Query) cho mọi tác vụ gọi API (`useQuery`, `useMutation`).
- **Global State:** Sử dụng `Zustand` (ví dụ: Auth Store).
- **Local State:** Sử dụng `useState` nội bộ trong Component.

## 3. Quy chuẩn Code (Coding Conventions)
- **Tên Component:** PascalCase (vd: `AppointmentTable.tsx`).
- **Hooks:** camelCase, bắt đầu bằng `use` (vd: `useAppointments.ts`).
- **API:** Mọi HTTP Request phải gọi qua `axiosClient` đã được cấu hình sẵn Interceptor để đính kèm Token.
- **UI:** Sử dụng thư viện UI nội bộ (dựa trên Tailwind CSS & Lucide Icons).

## 4. Routing
- Khai báo tại `src/routes/index.tsx`. 
- Các Route phải được bọc trong `ProtectedRoute` để chặn người dùng chưa đăng nhập.

*Tài liệu này đã được cô đọng. Các hướng dẫn cũ (api.md, state.md...) đã được loại bỏ để tránh rườm rà.*
