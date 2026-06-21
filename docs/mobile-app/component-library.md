# 🧩 Hệ thống UI Components (Widget Library)

Bí quyết để Mobile App trông "Premium" và đồng bộ là xây dựng hệ thống Component tái sử dụng.

## 1. Core Widgets (`lib/widgets/common/`)
Toàn bộ dự án phải sử dụng các Widget tự chế tạo để thay thế Widget mặc định của Flutter:
- **`ClinicButton`**: Nút bấm với thiết kế bo góc lớn (Radius 30), hỗ trợ gradient màu, tự động có trạng thái Loading (hiện vòng quay) khi đang xử lý sự kiện.
- **`ClinicTextField`**: Khung nhập liệu đồng nhất, nền xám nhạt tinh tế, không có viền cạnh sắc, hỗ trợ icon hai đầu và validation lỗi màu đỏ rõ ràng.
- **`ClinicDropdownField`**: Form chọn dropdown, nhưng khi ấn vào sẽ bật một `ModalBottomSheet` cao cấp từ dưới lên (Premium Design) thay vì menu dropdown xổ xuống cổ điển.
- **`ClinicDateField`**: Tương tự Dropdown, ấn vào sẽ hiện lịch chọn ngày bằng DatePicker giao diện cuộn hoặc lịch.

## 2. Thiết kế Thẻ (Cards)
Ứng dụng ứng dụng rất nhiều thẻ thông tin (Hồ sơ, Lịch hẹn, Bác sĩ).
Mọi thẻ đều tuân thủ nguyên tắc:
- `Container` nền trắng tinh (Tránh dùng Card mặc định của Material vì shadow hơi cổ điển).
- Cạnh bo tròn lớn (`BorderRadius.circular(20)`).
- Đổ bóng (BoxShadow) siêu nhẹ, blur lớn (`blurRadius: 16`, opacity: `0.04`) tạo cảm giác thẻ đang "nổi bồng bềnh" một cách thanh lịch.
