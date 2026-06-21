# 🧩 Hệ thống Component (Component Library)

Dự án áp dụng phương pháp thiết kế Atomic Design nhưng tối giản thông qua thư viện UI.

## 1. Công cụ sử dụng
- **Tailwind CSS:** Cho phép style nhanh chóng ngay trên HTML. Cấm viết CSS thuần (trừ khi quá đặc biệt).
- **Shadcn UI:** Bộ component có thể copy-paste source code. Shadcn không phải là thư viện cài qua npm, mà nó tải trực tiếp mã nguồn về dự án (vào `src/components/ui/`), giúp bạn tùy biến thiết kế 100%.
- **Lucide Icons:** Bộ icon SVG mặc định.

## 2. Quy tắc sử dụng Component
- Luôn tìm trong `src/components/ui/` xem đã có Component cần dùng chưa trước khi tự viết lại từ đầu. (Ví dụ: `Button`, `Input`, `Dialog`, `DropdownMenu` đều đã có sẵn).
- Khi tạo một khối UI phức tạp dùng chung (VD: `PatientCard`), hãy đặt nó vào `src/components/shared/`.

## 3. Xử lý ClassName động
Sử dụng hàm tiện ích `cn()` (kết hợp giữa `clsx` và `tailwind-merge`) để gộp class mượt mà, không sợ xung đột ưu tiên CSS.
```tsx
import { cn } from '@/utils/tailwind';

<div className={cn('p-4 bg-white', isError && 'bg-red-500 border-red-500')}>...</div>
```
