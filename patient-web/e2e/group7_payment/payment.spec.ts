import { test, expect } from '@playwright/test';

test.describe('Nhóm 7: Thanh toán viện phí (Patient Web)', () => {

  test.beforeEach(async ({ page }) => {
    // Đăng nhập Bệnh nhân
    await page.goto('/auth/login');
    await page.getByPlaceholder('Nhập email của bạn').fill('patient1@clinic.com');
    await page.getByPlaceholder('Nhập mật khẩu').fill('12345678');
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
    await expect(page).not.toHaveURL(/.*login/);
  });

  test('TC07-02: Bệnh nhân xem danh sách hóa đơn cá nhân (Smoke Test)', async ({ page }) => {
    await page.goto('/profile/billing');
    await expect(page.getByText('Hóa Đơn & Thanh Toán')).toBeVisible();
  });

  test('TC07-07: Bệnh nhân chọn thanh toán chuyển khoản (Smoke Test)', async ({ page }) => {
    await page.goto('/profile/billing');
    await expect(page.getByText('Hóa Đơn & Thanh Toán')).toBeVisible();
  });

});
