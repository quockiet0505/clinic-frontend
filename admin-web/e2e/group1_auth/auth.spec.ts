import { test, expect } from '@playwright/test';

test.describe('Nhóm 1: Đăng nhập Admin Web', () => {
  test('TC 1.3: Quản trị viên đăng nhập thành công', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@clinic.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button:has-text("Đăng nhập")');
    await expect(page).toHaveURL(/.*dashboard/);
  });
});
