# 🚀 Hướng dẫn Cài đặt & Khởi chạy (Setup Guide) - Mobile App

Tài liệu này giúp bạn thiết lập máy tính cá nhân để chạy và phát triển dự án Flutter.

## 1. Cài đặt Môi trường (Prerequisites)
- Cài đặt **Flutter SDK** (Khuyến nghị bản Stable >= 3.19).
- Thêm đường dẫn `flutter/bin` vào biến môi trường PATH.
- Cài đặt **Android Studio** (Bắt buộc để cài Android SDK, Emulator).
- Nếu xài Mac: Cài đặt **Xcode** (Để chạy iOS Simulator).
- Chạy lệnh `flutter doctor` trong terminal để kiểm tra xem máy tính đã đáp ứng đủ yêu cầu chưa.

## 2. Chuẩn bị Dự án
Mở terminal, điều hướng vào thư mục mobile app:
```bash
cd core_code/clinic-frontend/mobile-app
```
Kéo các gói thư viện (Packages) về máy:
```bash
flutter pub get
```

## 3. Cấu hình Kết nối với API Backend
Do Emulator là một cỗ máy ảo riêng biệt, khái niệm `localhost` của nó trỏ về chính nó, chứ không phải máy tính của bạn.
- Mở file `lib/core/constants/api_constants.dart`.
- Nếu bạn chạy **Android Emulator**, đổi URL thành: `http://10.0.2.2:8080/api/v1`
- Nếu bạn cắm cáp **điện thoại thật**, đổi URL thành IP mạng LAN của máy tính (VD: `http://192.168.1.15:8080/api/v1`).
- Nếu test bằng **iOS Simulator**, vẫn dùng `http://127.0.0.1:8080/api/v1`.

## 4. Build và Chạy App
Khởi động máy ảo (Emulator/Simulator) hoặc cắm điện thoại.
Kiểm tra thiết bị nhận diện:
```bash
flutter devices
```
Chạy ứng dụng:
```bash
flutter run
```
Sử dụng phím `r` trong terminal để **Hot Reload** (Cập nhật UI trong chưa tới 1s), và `R` để **Hot Restart**.
