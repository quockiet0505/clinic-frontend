# Hướng Dẫn Dành Cho Lập Trình Viên (Mobile App - Flutter)

## 1. Cấu trúc thư mục (Feature-based)
Dự án Flutter được tổ chức theo kiến trúc tính năng (Feature-based):
- `lib/screens/`: Giao diện các màn hình chính (Chat, Home, Profile, Booking).
- `lib/models/`: Các Data Models (DTOs) ánh xạ từ JSON của API (vd: `AppointmentModel`, `RecordModel`).
- `lib/services/`: Chứa các class gọi API (`api_service.dart`, `ai_chat_service.dart`).
- `lib/providers/`: Quản lý State bằng Provider.
- `lib/widgets/`: Các UI component dùng chung.

## 2. Quản lý Trạng thái (State Management)
- Sử dụng **Provider** cho Global State (Quản lý User đăng nhập, Giỏ hàng dịch vụ, Trạng thái Chat).
- Đối với State cục bộ của UI (như mở rộng thẻ, gõ text), dùng `StatefulWidget` thông thường.

## 3. Xác thực & Gọi API
- Token (`jwt_token`) được lưu trữ an toàn bằng thư viện `flutter_secure_storage`.
- Mọi API được gọi thông qua thư viện `Dio` (tại `api_service.dart`), tự động gắn Token vào Header `Authorization`.

## 4. Tích hợp AI Chatbot
- File `ai_chat_service.dart` tự động lấy Token hiện tại để gán vào body `access_token` khi POST tin nhắn lên Python Server, đảm bảo bảo mật và cá nhân hóa.

*Tài liệu này đã được cô đọng. Các hướng dẫn cũ (api.md, state.md...) đã được loại bỏ để tránh rườm rà.*
