# 📦 Hướng dẫn Phát hành (Deployment) - Mobile App

Cách đóng gói ứng dụng Flutter thành file chạy thực tế.

## 1. Build cho Android (APK / AppBundle)
Trước khi build, đổi phiên bản (Version) trong file `pubspec.yaml`.

Tạo file APK (Dùng để gửi trực tiếp cho test, cài ngoài store):
```bash
flutter build apk --release
```
File được xuất ra tại: `build/app/outputs/flutter-apk/app-release.apk`

Tạo file AppBundle (Dùng để upload lên Google Play Store - Bắt buộc):
```bash
flutter build appbundle --release
```

## 2. Build cho iOS
Yêu cầu bạn phải chạy lệnh trên máy MacOS đã cài Xcode.
- Đăng nhập tài khoản Apple Developer vào Xcode.
- Chọn Team trong mục Signing & Capabilities.
- Chạy lệnh build IPA để upload lên App Store Connect qua TestFlight:
```bash
flutter build ipa --release
```
