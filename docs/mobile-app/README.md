# 📱 Clinic Mobile App

Tài liệu dự án Ứng dụng Di động dành cho hệ sinh thái Clinic Management.
Ứng dụng được thiết kế nhằm cung cấp trải nghiệm Đặt lịch khám, Theo dõi sức khỏe, Tra cứu hồ sơ y tế chuyên nghiệp, trực quan trên các thiết bị Android và iOS.

## 💡 Tech Stack
- **Framework:** Flutter SDK (Cross-platform)
- **Ngôn ngữ:** Dart
- **Design System:** Material Design 3 (Đã tinh chỉnh theo phong cách Minimal & Premium, bo góc lớn, đổ bóng mượt mà, sử dụng gradient).
- **State Management:** Provider
- **Local Database:** SharedPreferences / Hive (cho caching).
- **Network:** Http / Dio.

## 📅 Đặt lịch khám

| Luồng | `bookingMode` | Slot API |
|-------|---------------|----------|
| Chọn bác sĩ | `DOCTOR` | `doctorId` + `date` |
| Chọn chuyên khoa | `EXPERTISE` | `expertiseId` + `date` (slot có `doctorId`) |
| Chọn dịch vụ | `SERVICE` | `serviceId` + `date` |

- Provider: `lib/providers/appointment_provider.dart`
- Service: `lib/services/booking_service.dart` → `POST /appointments` với `suggestedExpertiseId`, `isAiSuggested`
- AI gợi ý: `applyAiSuggestion()` trên provider

## 🤖 AI Chat

- Service: `lib/services/ai_chat_service.dart`
- Env: `AI_CHAT_URL` (Android emu: `http://10.0.2.2:8000`)
- Tự gửi `access_token` từ SecureStorage `jwt_token` khi user đã login

Chi tiết: repo `clinic-ai-chat/docs/integration-guide.md`
