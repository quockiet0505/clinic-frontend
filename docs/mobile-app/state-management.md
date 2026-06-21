# 🧠 Quản lý Trạng thái (State Management)

Dự án Flutter áp dụng thư viện **Provider** làm xương sống cho việc quản lý trạng thái. Provider đơn giản, ít boilerplate và được khuyên dùng bởi Google.

## 1. Khởi tạo Providers
Tất cả Provider chính của App được đăng ký ở cấp cao nhất trong `main.dart` thông qua `MultiProvider`.
Điều này cho phép mọi màn hình bên dưới đều có quyền truy cập vào data.
```dart
MultiProvider(
  providers: [
    ChangeNotifierProvider(create: (_) => AuthProvider()),
    ChangeNotifierProvider(create: (_) => AppointmentProvider()),
  ],
  child: const MyApp(),
)
```

## 2. Cách đọc dữ liệu trên UI
**Cách 1: `context.watch<T>()`**
Sử dụng bên trong hàm `build()`. Cứ mỗi lần Provider gọi `notifyListeners()`, toàn bộ hàm `build` chứa biến này sẽ được vẽ lại. Tiện lợi nhưng có thể giảm hiệu suất nếu màn hình có quá nhiều đồ họa.

**Cách 2: `Consumer<T>` (Khuyên dùng)**
Bọc riêng một khu vực Widget nhỏ. Chỉ khu vực đó bị vẽ lại khi dữ liệu đổi.
```dart
Consumer<AuthProvider>(
  builder: (context, authProvider, child) {{
    return Text(authProvider.userName); // Chỉ text này rebuild
  }},
)
```

**Cách 3: `context.read<T>()`**
Dùng trong các sự kiện (onTap, onPressed) khi bạn chỉ muốn "bắn lệnh" thực thi một hàm, không cần theo dõi sự thay đổi để vẽ lại UI.
```dart
onPressed: () => context.read<AuthProvider>().logout(),
```
