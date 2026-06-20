# Kế hoạch Redesign — Patient Web

> **Trạng thái**: Draft · **Ưu tiên thực hiện**: Trang chủ → Bác sĩ → Dịch vụ → Liên hệ
> **Tone / Direction**: Sáng sủa, hiện đại, đáng tin cậy — như một phòng khám tư cao cấp.

---

## 1. Phân tích hiện trạng

### Những gì đang ổn ✅
- Bảng màu primary đã đúng hướng: `sky-500 (#0ea5e9)` — xanh y tế sáng, hiện đại.
- Doctor card & Service card ở trang danh sách: layout rõ ràng, hover effect tốt.
- Trang Liên hệ: Cấu trúc tốt (hero + 4 cards nổi + map/form).
- Footer: Dark footer chuẩn, đầy đủ thông tin.
- Navbar: Dropdown menu chuyên khoa/dịch vụ chạy tốt.

### Vấn đề cần sửa ❌

| Trang | Vấn đề |
|---|---|
| **Trang chủ — Hero** | Ảnh banner đến từ API, nếu ảnh xấu/hỏng → cả hero mất kiểm soát. Text overlay trắng mờ dễ mất readability. Thiếu CTA rõ ràng. |
| **Trang chủ — Quick Actions** | Cards nhỏ (130×130) float trên `-mt-16`, trông "lơ lửng", không liền mạch với phần còn lại. |
| **Trang Bác sĩ & Dịch vụ — Hero** | Màu navy đậm `#003b5c` lệch hoàn toàn với tone xanh sáng ở trang chủ. 5 bullet points quá dày, không cần thiết. |
| **SpecialtyCarousel** | Icon chuyên khoa không có khung/card, trông "trơ" trên nền trắng. |
| **Thiếu section "Trust"** | Landing page không có section thống kê (số bác sĩ, số bệnh nhân...) hay testimonial để xây dựng niềm tin. |
| **Không nhất quán** | Trang chủ: `bg-white`. Bác sĩ/Dịch vụ: `bg-[#f4f8fb]`. Liên hệ: `bg-[#f0f9ff]`. Ba tông khác nhau. |

---

## 2. Design System — Giữ nguyên & Nhất quán

### Màu sắc (đã có sẵn trong index.css — chỉ cần dùng đúng)
```
Primary xanh sáng:  primary-500 (#0ea5e9)  ← màu chủ đạo
Background pages:   primary-50  (#f0f9ff)  ← dùng THỐNG NHẤT cho toàn bộ trang
Hero accent:        primary-100 (#e0f2fe)  ← hero section
Dark text/brand:    brand-dark  (#0c4a6e)  ← heading, text chính
Gradient nhẹ:       gradient-blue (#e0f2fe) → white
```

### Quy tắc thống nhất
- **Background toàn trang**: `bg-primary-50` (`#f0f9ff`) — thay cho `#f4f8fb`, `#f5f7f9` đang lẫn lộn.
- **Hero mỗi trang**: Nền gradient xanh sáng (không dùng dark navy nữa), overlay ảnh tùy chọn.
- **Section alternating**: Sections lần lượt dùng `bg-white` → `bg-primary-50` → `bg-white` để tạo nhịp.
- **Font**: Inter (đang dùng) — giữ nguyên.
- **Radius cards**: `rounded-[24px]` (đang dùng tốt) — giữ nguyên.

---

## 3. Trang chủ (LandingPage)

### 3.1 Hero Section — Redesign hoàn toàn

**Vấn đề hiện tại**: Phụ thuộc ảnh API làm background → mất kiểm soát design. Text center trên overlay trắng mờ.

**Hướng mới — "Light Blue Split Hero"**:
```
┌─────────────────────────────────────────────────────────┐
│  bg: from-primary-100 via-primary-50 to-white (gradient) │
│                                                          │
│  LEFT (55%)                  RIGHT (45%)                 │
│  ┌─────────────────────┐   ┌───────────────────────┐    │
│  │ Badge: "Phòng khám  │   │                       │    │
│  │  uy tín #1"         │   │   [Ảnh bác sĩ / hero  │    │
│  │                     │   │    illustration]       │    │
│  │ H1: Đặt lịch khám   │   │                       │    │
│  │ dễ dàng, nhanh      │   │  ╔════════════════╗   │    │
│  │ chóng               │   │  ║  4.9★ Đánh giá ║   │    │
│  │                     │   │  ║  500+ Bác sĩ   ║   │    │
│  │ Search bar          │   │  ╚════════════════╝   │    │
│  │                     │   └───────────────────────┘    │
│  │ [Đặt khám ngay] [Tìm│                                │
│  │  bác sĩ]            │                                │
│  └─────────────────────┘                                │
│                                                          │
│  Trust stats: 500+ BS │ 20 Chuyên khoa │ 10k+ BN hài lòng│
└─────────────────────────────────────────────────────────┘
```

**Chi tiết thực hiện**:
- Bỏ `<img>` full-width từ API làm background chính.
- Nền: `bg-gradient-to-br from-primary-100 via-primary-50 to-white`.
- Ảnh bác sĩ/minh họa: Đặt bên phải, dùng ảnh tĩnh có sẵn hoặc ảnh từ API trong `<img>` thông thường.
- H1: Left-align, font `text-4xl md:text-5xl font-black`, màu `text-brand-dark`.
- 2 nút CTA: `Đặt khám ngay` (primary-500, filled) + `Tìm bác sĩ` (outline, border-primary-300).
- Trust stats bar: Row 3 số liệu phía dưới CTA, mỗi item có icon + số + label nhỏ.
- **Bỏ 3 CheckCircle bullet points** → quá dài, thay bằng 3 icon feature ngắn gọn hơn.

### 3.2 Quick Actions — Refresh nhẹ
**Vấn đề**: Cards 130×130 float ở `-mt-16`, tách rời.

**Hướng mới**:
- Section riêng biệt ngay dưới hero, nền trắng.
- Dùng pill/chip style thay vì square cards: Mỗi action là `flex items-center gap-2 px-4 py-3 bg-white rounded-2xl shadow-sm border`.
- Layout: Horizontal scroll trên mobile, wrap trên desktop.

### 3.3 Specialty Carousel — Nâng cấp icon styling
- Bọc mỗi icon trong một `div` tròn nhẹ: `bg-primary-50 rounded-full p-3` hover → `bg-primary-100`.
- Thêm border nhẹ khi hover.
- Giữ grid layout (đang tốt).

### 3.4 Featured Doctors — Giữ nguyên cơ bản
- Card design ổn, chỉ cần nền section nhất quán.
- Section bg: `bg-gradient-to-b from-primary-50 to-white`.

### 3.5 Services (HowItWorks) — Giữ nguyên
- Card với ảnh thumbnail + giá — ổn.

### 3.6 Thêm section "Trust & Social Proof" (MỚI)
Thêm một section ngắn giữa FeaturedDoctors và HowItWorks:
```
┌──────────────────────────────────────────────────────────┐
│  "Tại sao chọn ClinicPro?"                bg-white        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ 500+     │  │ 20       │  │ 4.9/5    │  │ Hủy lịch │ │
│  │ Bác sĩ   │  │ Chuyên   │  │ Đánh giá │  │ hoàn tiền│ │
│  │ chuyên   │  │ khoa     │  │ trung    │  │ 100%     │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## 4. Trang Bác sĩ (DoctorDirectory)

### Hero Section — Đổi từ dark navy → light blue

**Hiện tại**: `bg-gradient from-[#003b5c]/95` → Quá tối, không đồng bộ.

**Hướng mới**:
```
┌─────────────────────────────────────────────────────────┐
│  bg: from-primary-700/80 via-primary-600/70 (xanh đậm   │
│  hơn nhưng vẫn trong dải primary, không navy đen)       │
│                                                          │
│  + Ảnh bác sĩ overlay (opacity-30, mix-blend-overlay)   │
│  + Decorative blob tròn màu primary-400/20 góc phải     │
│                                                          │
│  H1: "Đội ngũ Bác sĩ Chuyên khoa"                      │
│  Sub: 1 dòng mô tả ngắn                                 │
│  + 3 stats nhỏ (số bác sĩ, rating TB, lượt khám)       │
└─────────────────────────────────────────────────────────┘
```

**Chi tiết**:
- Rút gọn từ 5 bullet points → chỉ còn 3 điểm nổi bật nhất.
- Bỏ "Chat ngay" button trong hero (giữ ở footer/chatbot floating).
- Phone number: Giữ nhưng style nhẹ hơn.

### Danh sách bác sĩ — Giữ nguyên
- Doctor cards layout: Tốt, giữ.
- Filter toolbar: Tốt, giữ.
- Background: `bg-primary-50` (thay `bg-[#f4f8fb]`).

---

## 5. Trang Dịch vụ (ServiceDirectory)

Tương tự Trang Bác sĩ — đổi hero từ dark navy sang primary gradient.

- H1: "Dịch vụ Xét nghiệm & Khám bệnh"
- 3 điểm nổi bật thay vì 5.
- Service cards: Giữ nguyên (đang tốt).

---

## 6. Trang Liên hệ (ContactPage)

**Đánh giá**: Trang này đã khá tốt. Chỉ cần:
- Đổi hero background từ `bg-brand-dark` (navy rất đậm) → `bg-primary-700` (đậm hơn nhưng vẫn trong tone xanh) để đồng bộ.
- Giữ nguyên form, map, FAQ structure.

---

## 7. Header & Footer

### Header — Refresh nhỏ
- Thêm top bar mỏng 32px: `bg-primary-600 text-white text-xs` với hotline + "Đặt khám online mọi lúc".
- Active nav link: Thêm `bg-primary-50 rounded-full` thay vì chỉ underline.
- Nút "Đặt khám" bên phải nav: Đổi sang gradient button nổi bật hơn.

### Footer — Giữ nguyên
Footer dark đang tốt. Không cần thay đổi cấu trúc.

---

## 8. Thứ tự ưu tiên thực hiện

| # | Việc cần làm | Mức độ | Ảnh hưởng |
|---|---|---|---|
| 1 | **Redesign HeroSection** (light overlay, dark text) | Cao | Cao nhất |
| 2 | **Đổi hero DoctorDirectory & ServiceDirectory** (bỏ dark navy) | Trung bình | Cao |
| 3 | **Đồng bộ background** toàn trang về `bg-primary-50` | Thấp | Trung bình |
| 4 | **Nâng cấp SpecialtyCarousel** (thêm icon wrapper) | Thấp | Trung bình |
| 5 | **Thêm Trust section** ở Landing page | Trung bình | Trung bình |
| 6 | **Top bar Header** | Thấp | Thấp |
| 7 | **Quick Actions refresh** | Thấp | Thấp |

---

## 9. Những gì KHÔNG thay đổi

- Logic gọi API, routing, authentication.
- Doctor card layout ở DoctorDirectory (đang tốt).
- Service card layout ở ServiceDirectory (đang tốt).
- Contact form structure.
- Footer structure.
- Toàn bộ booking flow.
