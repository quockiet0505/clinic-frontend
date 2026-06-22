# Changelog — Clinic Frontend

## [2026-06-22] - Đặt lịch 4 mode + AI token

### Patient Web
- `BookingForm`: `bookingMode` DOCTOR / EXPERTISE / SERVICE; slot theo bác sĩ / khoa / dịch vụ
- `BookAppointment`: query `suggestedExpertiseId`, `isAiSuggested`
- `chatbotApi`: gửi `access_token` khi đã login (AI đặt lịch hộ)

### Mobile App
- `booking_service`: `GET /appointments/slots`; payload `bookingMode`, `suggestedExpertiseId`, `isAiSuggested`
- `appointment_provider`: slot EXPERTISE/SERVICE; `applyAiSuggestion()`
- `ai_chat_service`: gửi JWT từ SecureStorage

### Admin Web
- `AppointmentTable`: cột loại đặt, badge AI, `suggestedExpertiseName`

### Docs
- Cập nhật `docs/patient-web`, `docs/mobile-app`, `docs/admin-web` README
