# Quy tắc Code (Coding Conventions) - Patient Web

Để đảm bảo tính đồng nhất và giữ phong cách **sáng sủa, hiện đại, đáng tin cậy**, vui lòng tuân thủ các quy tắc sau.

## 1. UI & Styling

- **Tailwind CSS** cho toàn bộ styling trang web.
- **Màu chủ đạo**: dải `primary` + nền `bg-[#f0f9ff]`.
- **Hero Banner**: luôn dùng biến CSS trong `index.css`:
  ```css
  bg-gradient-to-r from-[var(--color-banner-dark-start)] via-[var(--color-banner-dark-mid)] to-primary-500
  ```
- **Nội dung trên banner**: chữ/icon `text-white`, search trên banner dùng `bg-white shadow-md`.
- **Bo góc**: `rounded-2xl` / `rounded-3xl`, viền `border-slate-200`, shadow nhẹ.

### Màu theo module hồ sơ y tế

| Trang | Màu accent | Nút Tải PDF | Nút chính |
|-------|------------|-------------|-----------|
| Đơn thuốc | `cyan` | `bg-cyan-50 text-cyan-700 border-cyan-200` | `bg-cyan-500` |
| Xét nghiệm / CLS | `cyan` | giống trên | `bg-cyan-500` |
| Hồ sơ cá nhân (Cập nhật) | `primary` | — | `bg-primary-500` |

## 2. Component dùng chung

### Layout & tìm kiếm

- `<SectionContainer>` bọc nội dung (`max-w-4xl` / `max-w-5xl`).
- `<SearchInput>` cho ô tìm kiếm (debounce, style thống nhất).

### FormModal (`components/common/FormModal.tsx`)

Dùng cho form popup (modal), không gắn cứng full-page.

| Prop | Mô tả |
|------|--------|
| `fields` | Cấu hình field: `text`, `number`, `textarea`, `select` |
| `columns` | `1` hoặc `2` cột |
| `colSpan` | Field full-width trong grid 2 cột |
| `maxWidth` | `sm` / `md` / `lg` / `xl` |
| `scrollable` | Body cuộn khi form dài (mặc định `true`) |
| `footerActions` | Tùy chỉnh nút footer (mặc định Hủy + Lưu) |
| `renderExtra` | Slot nội dung thêm dưới fields |

Ví dụ: `EditHealthProfileModal` refactor dùng `FormModal`.

### Form inline (full-page / tab)

- Tab **Thông tin** / **Bảo mật** trong `MyProfile`: form gắn trong card, nút submit `bg-primary-500`.
- Tab chuyển trang đặt **trong hero banner** (cùng pattern `MyProfile`, `MyReviews`).

## 3. PDF — ClinicPdfLayout & generatePdf

### Khi nào dùng

- Tải phiếu đơn thuốc, kết quả xét nghiệm, CLS.
- Không tự viết layout PDF riêng lẻ; mở rộng `ClinicPdfLayout`.

### Cấu trúc phiếu PDF

| Mục | Nội dung |
|-----|----------|
| **Header** | Logo phòng khám, tên, địa chỉ, tiêu đề phiếu, mã, ngày |
| **I. Bệnh nhân** | Họ tên, giới tính, năm sinh, SĐT, địa chỉ + **Hồ sơ sức khoẻ** (nhóm máu, chiều cao, cân nặng, HA, mạch, dị ứng, tiền sử) |
| **II. Khám bệnh** | Bác sĩ, chuyên khoa, KTV, ngày khám, chẩn đoán, dịch vụ |
| **III. Chi tiết** | Đơn thuốc: bảng thuốc + lời dặn. XN/CLS: kết quả đo lường + kết luận |
| **IV. Chi phí** | Tiền khám, tiền dịch vụ, tổng (nếu có) |
| **Chữ ký** | KTV (nếu có) + Bác sĩ điều trị |

### Quy ước kỹ thuật

- Layout PDF chỉ dùng **inline styles** (html2canvas không parse `oklch` của Tailwind).
- Logo: `{VITE_STATIC_BASE_URL}/images/logos/logo.png`, `crossOrigin="anonymous"`.
- Gọi `generatePdf(id, filename)` — tự toast success/error, **không dùng `alert()`**.
- Tên bác sĩ: luôn qua `formatDoctorName()` (tránh lặp `BS. BS CKII.`).

```ts
import { ClinicPdfLayout } from '@/components/common';
import { generatePdf, formatDoctorName } from '@/utils/generatePdf';

// Trong card
<ClinicPdfLayout id={`pdf-pres-${id}`} documentTitle="ĐƠN THUỐC" ... />
<button onClick={() => generatePdf(`pdf-pres-${id}`, 'DonThuoc_00001.pdf')}>
  Tải PDF
</button>
```

## 4. API & dữ liệu

- API qua `axiosInstance` (`src/config/axios.ts`).
- API theo feature: `recordApi`, `profileApi`, `reviewApi`...
- Hồ sơ sức khoẻ bệnh nhân: `profileApi.getMyProfile()` — merge vào PDF khi API record thiếu field.
- Lỗi 401/403: UI thân thiện (màn hình + nút đăng nhập lại), không crash trang.

## 5. Ảnh & static

- Ảnh backend: `getStaticUrl()` trong `src/utils/url.ts`.
- `<img onError={...}>` fallback khi ảnh lỗi.

## 6. Thông báo

- Dùng `toast` từ `sonner` cho success/error (PDF, form, đánh giá...).
- Không dùng `alert()` trừ trường hợp bắt buộc.
