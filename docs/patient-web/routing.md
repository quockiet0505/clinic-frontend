# 🛣️ Định tuyến (Routing)

Hệ thống sử dụng **React Router v6** kết hợp kiến trúc Data Router.

## 1. Cấu trúc Routing
Toàn bộ sơ đồ Router được khai báo tập trung tại `src/routes/index.tsx`.

## 2. Phân loại Route
- **Public Routes:** Trang không yêu cầu đăng nhập (Login, Đăng ký, Quên mật khẩu).
- **Private Routes (Protected):** Bắt buộc bọc trong component `ProtectedRoute`. Component này sẽ kiểm tra JWT token; nếu không có, tự động redirect về trang `/login`.

## 3. Lười tải (Lazy Loading) & Code Splitting
Để tối ưu tốc độ tải trang lần đầu, không import toàn bộ các Pages cùng lúc. Hãy sử dụng `React.lazy()` kết hợp `<Suspense>`.
```tsx
const DashboardPage = React.lazy(() => import('@/pages/Dashboard'));

// Sử dụng trong Router
<Route path="/dashboard" element={
  <Suspense fallback={<LoadingScreen />}>
    <DashboardPage />
  </Suspense>
} />
```
