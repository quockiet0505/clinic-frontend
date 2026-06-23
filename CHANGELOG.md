# Changelog — Clinic Frontend

## [2026-06-23] - Tối ưu UI Hồ sơ y tế & Đánh giá (Patient Web)

### Patient Web
- `RecordDetail`: Gom các nút tải PDF thành một nút duy nhất "Tải PDF bệnh án" ở sidebar, bao gồm đầy đủ chẩn đoán, xét nghiệm, đơn thuốc và chi phí.
- `Prescriptions`: Bỏ nút tải PDF từng đơn, thêm nút "Xem bệnh án" chuyển hướng đến chi tiết hồ sơ. Thêm các tab phân loại trạng thái (Tất cả, Đang điều trị, Đã hoàn thành).
- `LabResults`: Bỏ nút tải PDF từng kết quả, thêm nút "Xem bệnh án". Thêm dropdown filter custom "Loại dịch vụ" (Chẩn đoán hình ảnh, Xét nghiệm) và các tab trạng thái.
- `MyReviews`: Hiển thị số lượng đánh giá trong badge, sửa lỗi lặp tiền tố `BS.BS` bằng hàm `formatDoctorName`.
- `HealthProfile`: Đồng bộ cỡ chữ banner tiêu đề.
- `Select` (UI Component): Loại bỏ viền đen mặc định, thêm hiệu ứng focus màu primary và `cursor-pointer`.

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
