# 🛣️ Điều hướng (Routing)

Hệ thống Mobile App quản lý luồng điều hướng màn hình.

## 1. Phương pháp Điều hướng
Dự án sử dụng cơ chế **Navigator 1.0 (Push / Pop cơ bản)** vì sự trực quan và đơn giản cho luồng nghiệp vụ của app y tế.
```dart
// Chuyển sang màn hình mới (Chèn lên trên)
Navigator.push(
  context,
  MaterialPageRoute(builder: (context) => const DetailScreen(id: 1)),
);

// Quay lại màn hình cũ
Navigator.pop(context);

// Chuyển sang màn hình mới, xóa sạch lịch sử (Thích hợp cho đăng nhập xong vào Home)
Navigator.pushAndRemoveUntil(
  context,
  MaterialPageRoute(builder: (context) => const MainScreen()),
  (route) => false,
);
```

## 2. Quản lý Route Name
Với một số màn hình tĩnh cần truy cập từ Push Notification, dự án khai báo `routes` trong `MaterialApp` ở `main.dart`.
