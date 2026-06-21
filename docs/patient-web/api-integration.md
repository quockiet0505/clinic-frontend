# 🔌 Tích hợp API (API Integration)

Dự án sử dụng thư viện **Axios** để giao tiếp với Backend. Toàn bộ logic đã được cấu hình tập trung.

## 1. Cấu hình Axios Client (`src/services/axiosClient.ts`)
Tất cả request phải sử dụng đối tượng `axiosClient` đã được khởi tạo sẵn, KHÔNG import `axios` trực tiếp.

`axiosClient` đã được cấu hình:
- Tự động gắn **Base URL** lấy từ `.env`.
- Tự động thiết lập thời gian timeout.
- Chuyển hóa Data (Parse JSON tự động).

## 2. Request / Response Interceptors
- **Request Interceptor:** Trước khi call API, interceptor sẽ tự động lấy `accessToken` từ `localStorage` và nhét vào header `Authorization: Bearer <token>`. Do đó, bạn KHÔNG cần tự gắn token ở mỗi hàm.
- **Response Interceptor:** 
  - Nếu API trả về `401 Unauthorized`, tự động đẩy user về trang Login và clear token.
  - Tự động trích xuất `response.data` để bạn không cần phải `.data.data` nhiều lần.

## 3. Cách viết một API Method
Đặt trong thư mục `api/` của từng feature.

```ts
import axiosClient from '@/services/axiosClient';
import { User } from '../types';

export const getUserList = async (page: number): Promise<User[]> => {
  // Không cần ghi URL đầy đủ, không cần gắn Token.
  return axiosClient.get('/users', { params: { page } });
};
```
