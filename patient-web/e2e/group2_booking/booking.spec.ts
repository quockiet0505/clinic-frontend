import { test, expect } from '@playwright/test';

test.describe('Nhóm 2: Đặt lịch khám (Patient Web)', () => {

  test.beforeEach(async ({ page }) => {
    // Đăng nhập Bệnh nhân
    await page.goto('/auth/login');
    await page.getByPlaceholder('Nhập email của bạn').fill('patient1@clinic.com');
    await page.getByPlaceholder('Nhập mật khẩu').fill('12345678');
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
    await expect(page).not.toHaveURL(/.*login/);
  });

  test('TC02-01: Bệnh nhân đặt lịch theo Bác sĩ thành công (Smoke Test)', async ({ page }) => {
    await page.goto('/appointments/book');
    await expect(page.getByText('Thông tin đặt khám')).toBeVisible();
    await expect(page.getByText('Xác nhận đặt lịch')).toBeVisible();
  });

});
