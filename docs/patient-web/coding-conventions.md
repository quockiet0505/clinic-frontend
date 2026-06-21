# 💻 Tiêu chuẩn viết Code (Coding Conventions)

Để dự án dễ bảo trì và đọc hiểu bởi nhiều thành viên, toàn bộ code React/TypeScript phải tuân thủ chuẩn sau.

## 1. Quy tắc Đặt tên (Naming)
- **Thư mục:** Đặt tên bằng `kebab-case`. Ví dụ: `patient-profile`, `components/ui`.
- **Tên Component (File & Class):** Sử dụng `PascalCase`. VD: `DoctorList.tsx`, `AppointmentCard.tsx`.
- **Hàm & Biến cục bộ:** Sử dụng `camelCase`. VD: `handleFormSubmit`, `isOpen`.
- **Hằng số cục bộ/toàn cục:** Sử dụng `UPPER_SNAKE_CASE`. VD: `MAX_UPLOAD_SIZE_MB`, `API_ENDPOINTS`.

## 2. TypeScript Best Practices
- **Tuyệt đối cấm sử dụng `any`**. Mọi Props, State, API Response đều phải có `interface` hoặc `type` cụ thể.
- Đặt tên Interface/Type: Không dùng tiền tố `I`.
  - Sai: `interface IUser`
  - Đúng: `interface User`
- Ưu tiên `type` cho Union Types, `interface` cho Object Declarations.

## 3. Kiến trúc Component
- Một Component lý tưởng **không vượt quá 200 dòng**. Nếu dài hơn, hãy tách (Extract) thành các Sub-component.
- **Tách biệt Logic và UI:** Đẩy các logic phức tạp (gọi API, tính toán) vào Custom Hooks. Component chỉ nên làm nhiệm vụ "Hứng data và render UI".

*Ví dụ sai (Mớ bòng bong Logic & UI):*
```tsx
const UserProfile = () => {
  const [data, setData] = useState();
  useEffect(() => { fetch(...) }, []);
  // ... 50 dòng logic
  return <div>{data.name}</div>
}
```

*Ví dụ đúng (Sạch sẽ):*
```tsx
const UserProfile = () => {
  const { data, isLoading, error } = useUserProfile();
  if (isLoading) return <Spinner />;
  return <ProfileCard user={data} />
}
```

## 4. Linting & Formatting
Dự án đã cấu hình sẵn ESLint và Prettier.
Trước khi push code, bạn phải chạy lệnh:
```bash
npm run lint
npm run format
```
