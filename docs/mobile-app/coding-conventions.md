# 💻 Coding Conventions - Mobile App (Flutter)

Tài liệu này định nghĩa tiêu chuẩn viết code cho ứng dụng Mobile (Flutter/Dart) nhằm đảm bảo sự nhất quán và hiệu năng tối ưu.

## 1. Kiến trúc & Ngôn ngữ
- **Framework:** Flutter 3.x
- **Ngôn ngữ:** Dart
- **State Management:** Provider (hoặc Bloc/Riverpod tuỳ kiến trúc).

## 2. Quy tắc Đặt tên (Naming Conventions)
- **Thư mục & File:** `snake_case` (vd: `login_screen.dart`, `auth_provider.dart`).
- **Class, Enum, Typedef:** `PascalCase` (vd: `UserDetailScreen`, `AppColors`).
- **Biến & Hàm:** `camelCase` (vd: `fetchData()`, `userName`).
- **Biến private:** Bắt buộc có dấu `_` ở đầu (vd: `_isLoading`, `_initData()`).
- **Hằng số (Constants):** `camelCase` hoặc `UPPER_SNAKE_CASE` (tuyệt đối thống nhất trong file).

## 3. Quy tắc UI & Widget
- Ưu tiên sử dụng **StatelessWidget**. Chỉ dùng **StatefulWidget** khi thực sự cần quản lý state nội bộ, animation, hoặc lifecycle.
- Tách nhỏ Widget: Nếu hàm `build` quá dài (>100 dòng), hãy tách nhỏ thành các class Widget con (Extract Widget) thay vì các phương thức trả về Widget (`_buildSomething()`) để tối ưu hiệu năng rebuild.
- Sử dụng từ khoá `const` cho các Widget không đổi để giảm tải bộ nhớ.
- Tuyệt đối không dùng logic nghiệp vụ (gọi API) trực tiếp trong file màn hình UI.

## 4. Quản lý State & Dữ liệu
- Chuyển logic gọi mạng và xử lý dữ liệu vào các `Providers` hoặc `Services`.
- Xử lý lỗi (try/catch) triệt để và luôn hiển thị thông báo thân thiện (Snackbar, BottomSheet) cho người dùng.

## 5. Formatting & Linting
- Tuân thủ nghiêm ngặt cấu hình `analysis_options.yaml` của dự án.
- Code phải vượt qua lệnh `flutter analyze` mà không xuất hiện cảnh báo rác.
