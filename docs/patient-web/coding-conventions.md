# 💻 Coding Conventions - Patient Web

Tài liệu này định nghĩa các tiêu chuẩn viết code cho dự án Patient Web nhằm đảm bảo UI/UX cao cấp, thân thiện với bệnh nhân và dễ bảo trì.

## 1. Kiến trúc & Framework
- **Core:** React 18+, TypeScript, Vite.
- **Styling:** Tailwind CSS + Material/Shadcn phong cách hiện đại.
- **State Management:** React Query, Context API.

## 2. Quy tắc Đặt tên (Naming Conventions)
- **Thư mục & File logic:** `kebab-case` (vd: `appointment-service.ts`).
- **File Component:** `PascalCase` (vd: `DoctorCard.tsx`, `BookingForm.tsx`).
- **Hằng số (Constants):** `UPPER_SNAKE_CASE` (vd: `MAX_RETRIES`).
- **Hàm & Biến:** `camelCase` (vd: `handleBooking()`, `patientData`).
- **Interfaces & Types:** `PascalCase` (vd: `Appointment`, `DoctorProfile`).

## 3. Quy tắc React Components
- Chỉ sử dụng **Functional Components** với React Hooks.
- Mọi component UI hướng tới trải nghiệm người dùng (Patient-facing) cần đảm bảo có trạng thái Loading/Skeleton và Error states.
- Giữ logic UI tách biệt với logic nghiệp vụ (sử dụng custom hooks).
- Khai báo kiểu dữ liệu rõ ràng cho `props`.

## 4. Format & Linting
- **Prettier & ESLint:** Bắt buộc tuân thủ.
- **Dấu nháy:** Dùng nháy đơn (`'`) cho chuỗi, nháy kép (`"`) cho thuộc tính JSX.
- **Dấu phẩy (Trailing commas):** Bật trailing commas.

## 5. Xử lý ảnh & Static
- Mọi ảnh từ backend phải đi qua hàm `getStaticUrl()` để hiển thị đúng.
- Luôn sử dụng `onError` fallback trên thẻ `<img />` để tránh giao diện vỡ khi ảnh lỗi.

## 6. Thông báo & Tương tác
- Dùng các thư viện Toast hiện đại (`sonner` hoặc `react-hot-toast`) thay vì `alert()` mặc định của trình duyệt để hiển thị kết quả thao tác.
