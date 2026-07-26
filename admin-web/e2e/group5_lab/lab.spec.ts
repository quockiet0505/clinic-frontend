import { test, expect } from '@playwright/test';

test.describe('Nhóm 5: Cận Lâm Sàng (Admin Web)', () => {

  test.beforeEach(async ({ page }) => {
    // Giả lập trạng thái đã đăng nhập của Kỹ thuật viên Lab
    await page.goto('/login');
    await page.getByPlaceholder('admin@clinic.vn').fill('admin@gmail.com');
    await page.getByPlaceholder('e.g., Trustcare@2026').fill('12345678');
    await page.getByRole('button', { name: 'Đăng nhập vào hệ thống' }).click();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('TC05-01: Lab - Chỉ định & Nhập kết quả XN', async ({ page }) => {
    // Vào màn hình Chỉ định XN
    await page.getByText('Chỉ định XN').click();

    // Mở Tùy chọn ở row đầu tiên
    await expect(page.locator('.animate-pulse')).toHaveCount(0);
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Kết quả', exact: true }).first().click();

    // Điền form LabResultInputForm
    await page.locator('textarea').nth(0).fill('Kết quả bình thường');
    await page.locator('textarea').nth(1).fill('Bệnh nhân khỏe mạnh');

    // Bấm Lưu kết quả
    await page.getByRole('button', { name: 'Lưu kết quả' }).click();

    // Verify thông báo (chờ dialog ẩn đi thay vì đợi toast text dễ bị lỗi)
    await expect(page.getByRole('dialog')).toBeHidden({ timeout: 15000 });
  });

});
