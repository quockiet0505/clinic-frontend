import { test, expect } from '@playwright/test';

test.describe('Nhóm 7: Thanh toán & Xuất hóa đơn (Admin Web)', () => {

  test.beforeEach(async ({ page }) => {
    // Đăng nhập Lễ tân / Kế toán
    await page.goto('/login');
    await page.getByPlaceholder('admin@clinic.vn').fill('admin@gmail.com');
    await page.getByPlaceholder('e.g., Trustcare@2026').fill('12345678');
    await page.getByRole('button', { name: 'Đăng nhập vào hệ thống' }).click();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('TC07-04: Thanh toán hóa đơn', async ({ page }) => {
    // Truy cập Hóa đơn
    await page.getByRole('link', { name: 'Hóa đơn & Thanh toán' }).click();

    // Chờ trang tải xong
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Thu tiền', exact: true }).first().click();

    // Trong Modal, click button Tiền mặt
    await page.getByRole('button', { name: 'Tiền mặt', exact: true }).click();

    // Nhấp Xác nhận
    await page.getByRole('button', { name: 'Xác nhận' }).click();

    // Chờ Dialog đóng (sau khi API thanh toán hoàn tất)
    await expect(page.getByRole('dialog')).toBeHidden({ timeout: 15000 });
  });

});
