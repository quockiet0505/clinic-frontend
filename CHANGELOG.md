# Changelog — Clinic Frontend

## [2026-06-24] - Hiện đại hóa UI các trang chi tiết (Admin Web)

### Admin Web
- `DetailPageHeader` (mới, `components/common`): Header chuẩn dùng chung — back button, tiêu đề, mã code badge, status badge, vùng action. Helper `IconAction` + `ActionButton` đã được nâng cấp hỗ trợ **7 tone màu**: `default`, `primary`, `sky`, `emerald`, `violet`, `amber`, `rose` (mỗi tone có màu nền + hover phù hợp).
- `PatientSummaryBanner` (mới, `features/medical/components`): Banner thông tin BN gọn dùng chung giữa Triage và Consultation, hỗ trợ hiển thị sinh hiệu nhanh.
- `TriageWorkspace` (Chuẩn bị khám / Đo sinh hiệu): Redesign — fix bug card `overflow-hidden` + `h-[calc...]` clip content. Đổi sang `min-h` để form trải tự nhiên. Header có icon section gradient indigo. Nút **Hủy** tone `rose`, **Lưu** tone `primary`.
- `ConsultationWorkspace` (Đang khám bệnh): Bỏ 2 card sidebar lặp. Tabs Phiếu khám / Kê đơn full-width. Nút **Lưu nháp** tone `sky`, **Hoàn tất** tone `primary`.
- `MedicalRecordDetail`: `DetailPageHeader` với icon **In phiếu** tone `sky` (xanh nhạt), **Tải PDF** tone `emerald` (xanh lá). Bỏ card "Xuất hồ sơ" sidebar trùng.
- `LabResultDetail`: Redesign layout 2 cột **sidebar + paper-sheet** giống Medical Record. Sidebar có hero gradient blue + meta info + badge "Đã xác nhận hoàn tất" + trust badge. Main có document header với eyebrow + heading uppercase, các Section đánh dấu bằng icon màu (User=xanh, Beaker=tím, ClipboardCheck=xanh lá), kết quả + kết luận trong box accent màu.
- `PrescriptionDetail`: Tương tự — sidebar gradient emerald + billing summary, paper-sheet với section icon màu, vital cards 4 màu (rose/amber/sky/violet), bảng thuốc với header gradient emerald, badge order status có dot màu.
- `PatientDetails` (Hồ sơ bệnh nhân): Redesign hoàn toàn — `DetailPageHeader` + sidebar profile card có hero gradient + avatar nổi, pill giới tính/tuổi, quick stats (lượt khám, bệnh mãn tính). Main có 3 section: Tổng quan sức khỏe (6 health cards 6 màu khác nhau), Thông tin cá nhân, Lịch sử khám. Cảnh báo dị ứng box accent amber riêng. Nút **In hồ sơ** tone `sky`, **Chỉnh sửa** tone `emerald`.

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
