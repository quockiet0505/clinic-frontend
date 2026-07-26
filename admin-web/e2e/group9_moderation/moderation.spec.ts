// import { test, expect } from '@playwright/test';
// 
// test.describe('Nhóm 9: AI Content Moderation (Admin Web) - Tương ứng UC14 trong dàn ý', () => {
// 
//   test.beforeEach(async ({ page }) => {
//     // Đăng nhập Admin
//     await page.goto('/login');
//     await page.getByPlaceholder('admin@clinic.vn').fill('admin@gmail.com');
//     await page.getByPlaceholder('e.g., Trustcare@2026').fill('12345678');
//     await page.getByRole('button', { name: 'Đăng nhập vào hệ thống' }).click();
//     await expect(page).toHaveURL(/.*dashboard/);
//   });
// 
//   test('TC09-02: Admin duyệt bình luận bị AI đánh dấu', async ({ page }) => {
//     // Truy cập trang Phản hồi (CRM -> Phản hồi)
//     await page.getByRole('link', { name: 'Phản hồi' }).click();
// 
//     // Đợi bảng dữ liệu "Đánh giá bệnh nhân" load thành công
//     await expect(page.getByText('Đánh giá bệnh nhân')).toBeVisible();
// 
//     // Lọc các đánh giá có trạng thái PENDING (Đang duyệt) do AI gán cờ
//     await page.getByRole('combobox').filter({ hasText: 'Tất cả đánh giá' }).click();
//     await page.getByRole('option', { name: 'Đang duyệt' }).click();
// 
//     // Tìm bình luận bị cờ và click Từ chối/Chấp nhận trong menu action (Dấu 3 chấm)
//     // Giả định click vào dấu 3 chấm của dòng đầu tiên
//     await page.locator('table tbody tr').first().locator('button[aria-label="Actions"]').click();
// 
//     // Chọn "Từ chối" trong dropdown
//     await page.getByRole('menuitem', { name: 'Từ chối' }).click();
//     
//     // Cửa sổ xác nhận (nếu có)
//     const confirmBtn = page.getByRole('button', { name: 'Xác nhận' });
//     if (await confirmBtn.isVisible()) {
//         await confirmBtn.click();
//     }
// 
//     // Kiểm tra thông báo Toast
//     await expect(page.getByText('Đã cập nhật trạng thái')).toBeVisible();
//   });
// 
// });
