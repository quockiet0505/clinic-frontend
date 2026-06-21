# 📂 Cấu trúc Thư mục (Folder Structure) - Mobile App

Ứng dụng chia thư mục theo chuẩn mực Feature-based đan xen Layered, giúp dev không bị lạc lối giữa hàng chục file màn hình.

```text
lib/
├── core/                   # Cấu hình "Tim mạch" của dự án
│   ├── constants/          # Chứa AppColors, AppTextStyles, ApiEndpoints
│   ├── theme/              # Định nghĩa ThemeData (Light, Dark)
│   ├── errors/             # Global error handler (Failure class)
│   └── utils/              # Hàm dùng chung (Formatter tiền, Validator email)
│
├── models/                 # Model DTO (Lớp chuyển đổi JSON sang Object)
│   ├── user_model.dart
│   └── appointment_model.dart
│
├── providers/              # Quản lý trạng thái logic (State Management)
│   ├── auth_provider.dart  # Lưu token, thông tin người dùng
│   └── appointment_provider.dart
│
├── services/               # Nơi giao tiếp với thế giới bên ngoài (HTTP)
│   ├── api_service.dart    # Cấu hình Http client cơ bản
│   └── auth_service.dart   # Gọi API Login/Register
│
├── screens/                # Màn hình Giao diện (Phân theo tính năng)
│   ├── auth/               # Thư mục Đăng nhập/Đăng ký
│   │   ├── login_screen.dart
│   │   └── widgets/        # Các Widget nhỏ CHỈ dùng trong màn Login
│   ├── main/               # Màn hình chính chứa BottomNavigationBar
│   ├── home/               # Tab Trang chủ
│   └── appointment/        # Tab Quản lý Lịch hẹn
│
├── widgets/                # Các UI Widget Tái sử dụng TOÀN CỤC
│   ├── common/             # Các khối build sẵn: ClinicButton, ClinicTextField
│   └── layouts/            # Các cấu trúc layout tĩnh
│
└── main.dart               # Khởi tạo App, load môi trường, load Providers
```
