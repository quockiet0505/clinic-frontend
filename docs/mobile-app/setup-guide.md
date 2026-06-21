# 🚀 Setup Guide - Mobile App (Flutter)

Hướng dẫn cài đặt môi trường và chạy ứng dụng Mobile trên thiết bị thật hoặc máy ảo.

## Yêu cầu hệ thống
- Flutter SDK >= 3.x
- Dart SDK >= 3.x
- Android Studio (Cho phát triển Android)
- Xcode (Cho phát triển iOS - bắt buộc phải có máy Mac)

## Các bước cài đặt

1. **Clone dự án & Di chuyển vào thư mục:**
   ```bash
   cd core_code/clinic-frontend/mobile-app
   ```

2. **Lấy các thư viện dependencies:**
   ```bash
   flutter pub get
   ```

3. **Cấu hình môi trường / API:**
   - Mở file `lib/core/constants/api_constants.dart` (hoặc file cấu hình tương đương).
   - Kiểm tra Base URL. Nếu đang chạy API backend local với Android Emulator, hãy đổi localhost thành `http://10.0.2.2:8080/api/v1`. Đối với iOS Simulator, vẫn dùng `http://localhost:8080/api/v1`.
   - Nếu chạy trên điện thoại thật cắm cáp, thay IP thành địa chỉ IP mạng LAN của máy tính đang chạy server (VD: `http://192.168.1.5:8080/api/v1`).

4. **Khởi chạy ứng dụng:**
   - Đảm bảo thiết bị / máy ảo đã được nhận diện (chạy lệnh `flutter devices`).
   - Khởi chạy app:
     ```bash
     flutter run
     ```

## Các lệnh thường dùng
- `flutter clean`: Xóa thư mục build và cache (cần thiết khi gặp lỗi xung đột phiên bản).
- `flutter build apk`: Đóng gói file cài đặt `.apk` cho Android.
- `flutter analyze`: Quét toàn bộ lỗi và cảnh báo cú pháp code.
