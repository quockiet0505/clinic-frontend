import { test, expect } from '@playwright/test';

test.describe('Nhóm 1: Đăng nhập Patient Web', () => {
  test('TC 1.2: Bệnh nhân đăng nhập thành công', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'nguyenvana_test1@gmail.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button:has-text("Đăng nhập")');
    await expect(page).toHaveURL(/.*dashboard/);
  });
});
