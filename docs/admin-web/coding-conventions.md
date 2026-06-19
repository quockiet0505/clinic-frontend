# Quy tắc Code (Coding Conventions)

Để đảm bảo tính đồng nhất của dự án Admin Web, vui lòng tuân thủ các quy tắc sau:

## 1. UI & Styling
- Sử dụng **Tailwind CSS** cho toàn bộ styling.
- Hạn chế tối đa viết CSS thuần ra file riêng trừ khi thực sự cần thiết.
- Tái sử dụng các component có sẵn trong `src/components/common` (ví dụ: `FormDialog`, `CustomSelect`, `EntityAvatar`, `AvatarPicker`).

## 2. Gọi API
- Mọi API call phải thông qua `axiosInstance` được cấu hình sẵn tại `src/config/axios.ts` (đã gắn sẵn token và xử lý lỗi cơ bản).
- Phân tách API theo từng feature (ví dụ: `staffApi.ts` nằm trong `features/staffs/api/`).
- Các API trả về danh sách phân trang từ Backend nên dùng hàm `parsePagedResponse` trong `src/utils/pagedApi.ts` để chuẩn hóa dữ liệu trước khi đưa vào Table.

## 3. Form & Table
- **Bảng dữ liệu (Table)**: Sử dụng component `<Table />` trong `src/components/tables/Table.tsx`. Component này đã hỗ trợ sẵn loading, empty state và phân trang đồng bộ.
- **Form thêm/sửa**: Sử dụng `<FormDialog />` trong `src/components/common/FormDialog.tsx` để tạo các popup nhập liệu nhanh chóng, chuẩn form và đồng nhất về giao diện.
- **Dropdown/Select**: Sử dụng `<CustomSelect />` để tránh các lỗi liên quan đến Radix UI khi giá trị rỗng.

## 4. Xử lý Ảnh
- Mọi URL ảnh trả về từ backend chỉ là đường dẫn tương đối (ví dụ: `/images/...`).
- Khi hiển thị ảnh, luôn dùng hàm `getImageUrl(url)` trong `src/utils/image.ts` hoặc dùng component `<EntityAvatar />` để tự động nối domain backend và có fallback khi ảnh lỗi.
