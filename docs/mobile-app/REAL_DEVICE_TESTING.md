# Hướng Dẫn Kết Nối Ứng Dụng Flutter Với Máy Thật (Real Device)

Việc chạy ứng dụng Flutter trên máy thật (điện thoại Android hoặc iPhone) khác với máy ảo (Emulator/Simulator) ở điểm cốt lõi: **Máy thật không thể hiểu `localhost` là máy tính của bạn**.

Dưới đây là hướng dẫn chi tiết từ việc thiết lập thiết bị đến cấu hình kết nối API.

---

## Bước 1: Kích hoạt Gỡ lỗi trên thiết bị vật lý

### Đối với thiết bị Android (Windows/Mac)
1. Cắm cáp kết nối điện thoại với máy tính.
2. Trên điện thoại, vào **Cài đặt (Settings)** > **Giới thiệu về điện thoại (About Phone)**.
3. Nhấn liên tục 7 lần vào **Số bản dựng (Build Number)** để bật chế độ nhà phát triển.
4. Quay lại **Cài đặt** > **Tùy chọn nhà phát triển (Developer Options)**.
5. Bật **Gỡ lỗi USB (USB Debugging)**.
6. Màn hình điện thoại sẽ hiện popup "Cho phép gỡ lỗi USB?", chọn **Cho phép (Allow/OK)**.

### Đối với thiết bị iOS (Bắt buộc dùng Mac)
1. Cắm cáp kết nối iPhone với máy Mac, trên màn hình iPhone chọn **Tin cậy máy tính này (Trust this computer)**.
2. Mở điện thoại vào **Cài đặt** > **Quyền riêng tư & Bảo mật (Privacy & Security)** > cuộn xuống dưới cùng bật **Chế độ nhà phát triển (Developer Mode)**.
3. Khởi động lại điện thoại để kích hoạt.

---

## Bước 2: Cấu hình địa chỉ API (QUAN TRỌNG NHẤT)

Do máy thật có IP riêng, nếu app mobile dùng `localhost` hoặc `10.0.2.2` (IP máy ảo) thì app sẽ bị lỗi Connection Refused.
Bạn cần sửa file `.env` trong thư mục gốc của project `mobile-app`. Bạn có 2 lựa chọn:

### Lựa chọn 1: Gọi thẳng API đã Deploy trên mạng (Khuyên dùng)
Cách này đơn giản nhất, bạn không cần quan tâm mạng LAN hay IP máy tính.
Sửa file `.env` thành:
```env
# URL Java Backend (Đã deploy)
API_BASE_URL=http://api.duongquockiet.id.vn/api/v1
# URL AI Chat (Đang chạy Ngrok)
AI_CHAT_URL=https://judiciary-suitably-perpetual.ngrok-free.dev/api/v1
```

### Lựa chọn 2: Gọi API Local trên máy tính qua Wi-Fi
Yêu cầu: **Điện thoại và máy tính phải kết nối chung 1 mạng Wi-Fi.**

1. Lấy địa chỉ IP mạng LAN của máy tính:
   - Trên Windows: Mở CMD gõ lệnh `ipconfig`. Tìm dòng **IPv4 Address** (VD: `192.168.1.15`).
   - Trên Mac: Mở Terminal gõ lệnh `ifconfig | grep inet`.
2. Sửa file `.env` trên thư mục `mobile-app`:
```env
# Thay thế 192.168.1.15 bằng IP máy tính của bạn
API_BASE_URL=http://192.168.1.15:8080/api/v1
AI_CHAT_URL=http://192.168.1.15:8000/api/v1
```
*(Lưu ý: Tường lửa máy tính - Windows Defender Firewall - phải cho phép Public/Private Network truy cập vào cổng 8080 và 8000, nếu không điện thoại sẽ không tải được dữ liệu).*

---

## Bước 3: Build và chạy ứng dụng

Mở Terminal tại thư mục `mobile-app`:

1. Kiểm tra xem máy tính đã nhận diện được điện thoại chưa:
   ```bash
   flutter devices
   ```
   *Bạn sẽ thấy thiết bị vật lý của mình hiện ra trong danh sách (VD: SM G998B, iPhone 14).*

2. Khởi chạy app lên thiết bị thật:
   ```bash
   flutter run
   ```
   Nếu máy tính đang cắm cùng lúc nhiều thiết bị (vừa máy ảo, vừa máy thật), bạn chỉ định đích danh thiết bị bằng id:
   ```bash
   flutter run -d <id_thiet_bi>
   ```

3. App sẽ được cài đặt và tự động mở lên trên điện thoại thật của bạn. Bạn có thể sử dụng Hot Reload (nhấn phím `r` trong Terminal) bình thường như khi dev trên máy ảo!
