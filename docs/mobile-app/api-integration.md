# 🔌 Tích hợp API (API Integration)

Cách ứng dụng giao tiếp với hệ thống Spring Boot Backend.

## 1. Http Client
Dự án có thể sử dụng thư viện `http` gốc hoặc `dio`.
Mọi request mạng đều được gom vào một lớp vỏ bọc (`NetworkService` hoặc xử lý trực tiếp trong `Services/`).

## 2. Luồng gọi API
1. **Service Layer (`auth_service.dart`):** Hàm bất đồng bộ (`Future`) gọi lệnh HTTP GET/POST đến Backend. Bắt lỗi `try-catch`, kiểm tra status code 200/400.
2. **Model Layer (`user_model.dart`):** Service sử dụng hàm `.fromJson()` của Model để ánh xạ chuỗi JSON thô thành một đối tượng Dart Object có type an toàn.
3. **Provider Layer (`auth_provider.dart`):** Gọi Service, hứng Object, cập nhật vào biến lưu trữ nội bộ (như `_currentUser`) và gọi hàm `notifyListeners()` để báo cho UI.
4. **UI Layer (`profile_screen.dart`):** Lắng nghe từ Provider và hiển thị Object ra màn hình.

## 3. Quản lý Authentication Token
- Khi đăng nhập thành công, chuỗi JWT Token được lưu trữ an toàn bằng thư viện `shared_preferences` (hoặc `flutter_secure_storage`).
- Khi khởi động app, `AuthProvider` tự động đọc Token này từ bộ nhớ máy để xác định trạng thái đăng nhập.
- Mọi API cần bảo mật sẽ đọc Token này và tự chèn vào Header `Authorization: Bearer <token>`.
