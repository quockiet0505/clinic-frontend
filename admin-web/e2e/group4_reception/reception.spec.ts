import { test, expect } from '@playwright/test';

test.describe('Nhóm 4: Tiếp nhận & Khám bệnh (Admin Web)', () => {

  test.beforeEach(async ({ page }) => {
    // Đăng nhập bằng tài khoản Lễ tân
    await page.goto('/login');
    await page.getByPlaceholder('admin@clinic.vn').fill('receptionist@clinic.com');
    await page.getByPlaceholder('e.g., Trustcare@2026').fill('12345678');
    await page.getByRole('button', { name: 'Đăng nhập vào hệ thống' }).click();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('TC04-01: Lễ tân Check-in bệnh nhân thành công', async ({ page }) => {
    // Navigate to reception workspace
    await page.getByRole('link', { name: 'Lịch hẹn' }).click();

    // Lọc bệnh nhân bằng tên
    await page.getByPlaceholder('Tìm bệnh nhân (tên hoặc SĐT)...').fill('Nguyễn Văn An');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);

    // Click "Tùy chọn" để mở ActionMenu dropdown
    const firstRow = page.locator('table tbody tr').first();
    await firstRow.getByRole('button', { name: 'Tùy chọn' }).click();

    // Click Check-in trong dropdown menu (chờ cho dropdown hiện)
    await page.getByRole('button', { name: 'Check-in' }).first().click({ timeout: 10000 });

    // Xử lý trong Dialog (Khách ưu tiên, Xác nhận Check-in)
    await page.getByLabel('Khách ưu tiên').check();
    await page.getByRole('button', { name: 'Xác nhận Check-in' }).click();

    // Kiểm tra thông báo (Toast) - chờ dialog đóng trước
    await expect(page.getByRole('dialog')).toBeHidden({ timeout: 10000 });
    await expect(page.getByText('Đã check-in bệnh nhân')).toBeVisible({ timeout: 5000 });
  });

});
