# 🧠 Quản lý Trạng thái (State Management)

Việc quản lý state không tốt sẽ dẫn tới hiện tượng "Prop Drilling" và giảm hiệu suất (re-render thừa). Chúng ta phân tách rõ ràng 3 loại State.

## 1. Server State (Trạng thái dữ liệu từ API)
**Công cụ:** `React Query` (TanStack Query).
**Quy tắc:** Tuyệt đối không dùng `useState` + `useEffect` để fetch API. Thay vào đó, hãy viết Custom Hook bọc `useQuery` hoặc `useMutation`.

*Lợi ích:* 
- Tự động caching dữ liệu (Chuyển trang đi rồi quay lại không bị loading lại).
- Tự động xử lý trạng thái `isLoading`, `isError`.
- Hỗ trợ auto-refetch khi focus lại màn hình.

*Ví dụ:*
```tsx
const { data, isLoading } = useQuery({
  queryKey: ['users', page],
  queryFn: () => fetchUsers(page)
});
```

## 2. Global State (Trạng thái UI toàn cục)
**Công cụ:** `React Context` (cho dữ liệu ít thay đổi như Auth, Theme) hoặc `Zustand` (cho dữ liệu phức tạp).
**Quy tắc:** Chỉ đẩy những dữ liệu thực sự cần thiết ở nhiều nơi (vd: Info User Đang Đăng Nhập, Trạng thái Giỏ Hàng) lên Global State. Đừng nhét mọi thứ vào Global.

## 3. Local State (Trạng thái UI cục bộ)
**Công cụ:** `useState`, `useReducer`.
**Quy tắc:** Những gì chỉ component đó quan tâm (vd: input text, modal đang mở/đóng, tab đang active) thì giữ nó ở trong nội bộ Component đó.
