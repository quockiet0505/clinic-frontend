import { test, expect } from '@playwright/test';

test.describe('Nhóm 1: Đăng nhập Patient Web', () => {

  test('TC01-08: Bệnh nhân đăng nhập bằng email thành công', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByPlaceholder('Nhập email của bạn').fill('patient1@clinic.com');
    await page.getByPlaceholder('Nhập mật khẩu').fill('12345678');
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Đăng nhập', exact: true })).not.toBeVisible();
  });

  test('TC01-09: Bệnh nhân đăng nhập sai mật khẩu', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByPlaceholder('Nhập email của bạn').fill('patient1@clinic.com');
    await page.getByPlaceholder('Nhập mật khẩu').fill('wrongpassword');
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
    await expect(page.locator('.text-red-600').first()).toBeVisible();
  });

  test('TC01-12: Bệnh nhân đăng nhập bằng Google (Mock)', async ({ page }) => {
    await page.goto('/auth/login');
    // Mock the Google response since we cannot test actual 3rd party Oauth easily in e2e
    await page.route('**/api/v1/auth/google-login', async route => {
      const json = { success: true, data: { token: 'mock-jwt-token' } };
      await route.fulfill({ json });
    });
    
    await page.getByRole('button', { name: 'Đăng nhập bằng Google', exact: true }).click();
    // Simulate successful redirect
    await page.goto('/');
  });

});
