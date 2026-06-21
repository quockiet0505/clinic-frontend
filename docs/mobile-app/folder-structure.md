# 📂 Folder Structure - Mobile App

Dự án Flutter được tổ chức theo mô hình Feature-driven kết hợp Layered Architecture để dễ dàng mở rộng và bảo trì tính năng.

```text
mobile-app/
├── android/                # Cấu hình native Android
├── ios/                    # Cấu hình native iOS
├── assets/                 # Hình ảnh, icon, fonts
├── lib/
│   ├── core/               # Các thiết lập lõi (Constants, theme, error handlers)
│   ├── models/             # Data Models (Chuyển đổi JSON)
│   ├── providers/          # Quản lý trạng thái (State Management)
│   ├── screens/            # Màn hình giao diện chính
│   │   ├── auth/           # Đăng nhập, Đăng ký
│   │   ├── home/           # Trang chủ ứng dụng
│   │   ├── appointment/    # Luồng đặt lịch, danh sách lịch
│   │   ├── records/        # Quản lý hồ sơ y tế
│   │   └── profile/        # Quản lý cá nhân
│   ├── services/           # Kết nối API, logic HTTP request
│   ├── utils/              # Các hàm tiện ích dùng chung (formatDate, validators)
│   ├── widgets/            # Các UI component độc lập, tái sử dụng (button, input)
│   └── main.dart           # File khởi chạy ứng dụng
├── pubspec.yaml            # Khai báo thư viện, phiên bản, tài nguyên
└── analysis_options.yaml   # Cấu hình kiểm tra mã nguồn (Linter)
```

## Các thư mục trọng điểm:
- `screens/`: Nơi chứa cấu trúc bố cục giao diện cho từng tính năng.
- `widgets/`: Nơi chứa các mảnh ghép UI nhỏ (nút bấm, thẻ thông tin).
- `providers/`: Lưu trữ các lớp cầu nối giữa UI và Data.
