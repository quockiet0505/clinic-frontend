# 📂 Folder Structure - Patient Web

Cấu trúc thư mục tối ưu cho trải nghiệm người dùng, phân chia rành mạch các màn hình chức năng chính của bệnh nhân.

```text
patient-web/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Hình ảnh minh hoạ, logo, icons
│   ├── components/         # Components dùng chung (Button, Modal, Toast)
│   ├── config/             # Cấu hình API, hệ thống
│   ├── contexts/           # AuthContext, NotificationContext
│   ├── features/           # Module chức năng chính
│   │   ├── appointments/   # Đặt lịch hẹn, quản lý lịch
│   │   ├── home/           # Landing page, Banner, Giới thiệu
│   │   ├── profile/        # Quản lý thông tin cá nhân
│   │   └── medical-records/# Xem hồ sơ y tế
│   ├── hooks/              # Custom hooks
│   ├── layouts/            # MainLayout (có header/footer), AuthLayout
│   ├── pages/              # Entry các màn hình
│   ├── routes/             # Định tuyến React Router
│   ├── services/           # Gọi API backend
│   ├── types/              # TypeScript Types
│   └── utils/              # Các hàm format (thời gian, tiền tệ)
├── .env                    # Biến môi trường
├── index.html              # Entry HTML
├── package.json            
├── tsconfig.json           
└── vite.config.ts          
```
