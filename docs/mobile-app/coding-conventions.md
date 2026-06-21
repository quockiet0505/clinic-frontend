# 💻 Coding Conventions & Flutter Best Practices

Dự án Flutter cần được viết code thật gọn gàng để tối ưu FPS và tránh "Spaghetti Code" (Nested Widget Hell).

## 1. Formatting & Linting
- **Quy tắc tuyệt đối:** Nhấn `Shift + Alt + F` (hoặc cấu hình Format On Save) trước khi commit. Code Dart phụ thuộc rất nhiều vào dấu phẩy (`,`) ở cuối ngoặc để format dạng cây đẹp mắt.
- Dự án có sử dụng `analysis_options.yaml` chứa các quy tắc linter. Không được bỏ qua các cảnh báo (Cố gắng fix hết các vạch vàng).

## 2. Naming Conventions (Quy tắc đặt tên)
- **Thư mục và Tên file:** `snake_case` (Ví dụ: `appointment_screen.dart`, `custom_button.dart`).
- **Class, Enum:** `PascalCase` (Ví dụ: `PatientModel`, `AuthService`).
- **Biến, Hàm:** `camelCase` (Ví dụ: `fetchData()`, `patientList`).
- **Biến Private:** Bắt buộc bắt đầu bằng dấu gạch dưới `_` (Ví dụ: `_isLoading`, `_scrollController`).

## 3. Widget & UI Rules
- Ưu tiên tối đa **StatelessWidget**. Chỉ dùng **StatefulWidget** khi màn hình đó có trạng thái biến đổi nội tại (Forms, Tabs, Animations).
- **Tối ưu Rebuild với `const`:** Luôn thêm từ khóa `const` trước các Widget tĩnh (Text, Padding, SizedBox). Điều này giúp Flutter bỏ qua việc vẽ lại Widget đó, tăng hiệu năng đáng kể.
- **Extract Widget:** Không viết một hàm `build()` dài cả ngàn dòng. Tách các khối UI thành các Widget con độc lập. Tránh dùng hàm (method) trả về Widget, hãy tạo Class mở rộng StatelessWidget.

*Sai (Viết hàm trả về Widget - Khó tối ưu memory):*
```dart
Widget _buildHeader() {{
  return Text("Hello");
}}
```
*Đúng (Viết Class - Có thể dùng `const`):*
```dart
class _Header extends StatelessWidget {{
  const _Header();
  @override Widget build(BuildContext context) => const Text("Hello");
}}
```
