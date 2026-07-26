import { test, expect } from '@playwright/test';

test.describe('Nhóm 6: Kê đơn (Admin Web)', () => {

  test.beforeEach(async ({ page }) => {
    // Đăng nhập Bác sĩ
    await page.goto('/login');
    await page.getByPlaceholder('admin@clinic.vn').fill('doctor@clinic.com');
    await page.getByPlaceholder('e.g., Trustcare@2026').fill('12345678');
    await page.getByRole('button', { name: 'Đăng nhập vào hệ thống' }).click();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('TC06-01: Bác sĩ kê đơn thuốc thành công', async ({ page }) => {
    // Vào danh sách Đang khám
    await page.getByRole('link', { name: 'Đang khám' }).click();

    // Mở bệnh nhân đầu tiên bằng nút Khám bệnh
    await page.getByRole('button', { name: 'Khám' }).first().click();

    // Bắt đầu khám để vào màn hình Phase 2
    await page.getByRole('button', { name: 'Bắt đầu khám' }).click();
    await page.getByPlaceholder('Nhập chẩn đoán bệnh...').fill('Cảm cúm');

    // Chuyển sang Tab Kê đơn thuốc
    await page.getByRole('button', { name: 'Kê đơn thuốc' }).click();

    // Thêm thuốc
    // Ô react-select
    await page.locator('input[role="combobox"]').first().fill('Hapacol 650');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Enter');
    await page.getByPlaceholder('vd: 1 viên, 2 lần/ngày').fill('1 viên/ngày');
    await page.getByPlaceholder('0').fill('10');
    
    // Nhấn button Thêm
    await page.getByRole('button', { name: 'Thêm' }).click();

    // Nhấn Lưu Đơn Thuốc
    await page.getByRole('button', { name: 'Lưu Đơn Thuốc' }).click();

    // Verify
    await expect(page.getByText('lưu đơn thuốc')).toBeVisible({ timeout: 15000 });
  });

});
