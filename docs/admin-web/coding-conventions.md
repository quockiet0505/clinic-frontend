# 💻 Coding Conventions - Admin Web

Tài liệu này định nghĩa các tiêu chuẩn viết code cho dự án Admin Web (React/Vite) nhằm đảm bảo tính đồng nhất, dễ đọc và dễ bảo trì.

## 1. Kiến trúc & Framework
- **Core:** React 18+, TypeScript, Vite.
- **Styling:** Tailwind CSS + Shadcn UI.
- **State Management:** React Query (server state), Zustand/Context (client state).

## 2. Quy tắc Đặt tên (Naming Conventions)
- **Thư mục & File logic:** `kebab-case` (vd: `user-service.ts`, `hooks/`).
- **File Component:** `PascalCase` (vd: `DashboardLayout.tsx`, `UserTable.tsx`).
- **Hằng số (Constants):** `UPPER_SNAKE_CASE` (vd: `MAX_PAGE_SIZE`, `API_URL`).
- **Hàm & Biến:** `camelCase` (vd: `fetchUsers()`, `isLoggedIn`).
- **Interfaces & Types:** `PascalCase` không có tiền tố "I" (vd: `User`, `ApiResponse`).

## 3. Quy tắc React Components
- Chỉ sử dụng **Functional Components** với React Hooks. Không dùng Class Components.
- Đặt các hooks ở trên cùng của component.
- Tách logic phức tạp ra thành Custom Hooks (`useFetchUser.ts`).
- Khai báo kiểu dữ liệu rõ ràng cho `props`. Không dùng `any` trừ trường hợp bất khả kháng.
- Ưu tiên sử dụng `Destructuring` cho props.

## 4. Format & Linting
- **Prettier & ESLint:** Bắt buộc tuân thủ quy tắc của ESLint/Prettier đã cấu hình.
- **Dấu nháy:** Dùng nháy đơn (`'`) cho chuỗi TS/JS, nháy kép (`"`) cho thuộc tính JSX.
- **Dấu phẩy (Trailing commas):** Bật trailing commas ở cuối đối tượng, mảng.

## 5. Comment & Document
- Dùng `JSDoc` để ghi chú các hàm logic phức tạp, utils dùng chung.
- Code phải tự giải thích (Self-documenting): Tên biến/hàm phải rõ nghĩa, hạn chế comment dư thừa cho những thứ hiển nhiên.
