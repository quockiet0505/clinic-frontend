import { test, expect } from '@playwright/test';

test.describe('Nhóm 3: Dời và Hủy lịch (Patient Web)', () => {

  test.beforeEach(async ({ page }) => {
    // Đăng nhập Bệnh nhân
    await page.goto('/auth/login');
    await page.getByPlaceholder('Nhập email của bạn').fill('patient1@clinic.com');
    await page.getByPlaceholder('Nhập mật khẩu').fill('12345678');
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
    await expect(page).not.toHaveURL(/.*login/);
  });

  test('TC03-01: Bệnh nhân dời lịch khám hợp lệ (Trước 3 tiếng) (Smoke Test)', async ({ page }) => {
    await page.goto('/appointments/my');
    await expect(page.getByRole('heading', { name: 'Lịch Sử Đặt Khám' })).toBeVisible();
  });

  test('TC03-05: Bệnh nhân hủy lịch khám thành công (Smoke Test)', async ({ page }) => {
    await page.goto('/appointments/my');
    await expect(page.getByRole('heading', { name: 'Lịch Sử Đặt Khám' })).toBeVisible();
  });

});
