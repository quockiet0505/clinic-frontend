import { test, expect } from '@playwright/test';

test.describe('Nhóm 2: Đặt lịch khám (Patient Web)', () => {
  test('TC 2.1: Bệnh nhân đặt lịch thành công', async ({ page }) => {
    await page.goto('/login');
    // ... logic login ...
    await page.goto('/booking');
    await page.click('text="Khám Nội tổng quát"');
    await page.click('text="Xác nhận đặt lịch"');
    await expect(page.locator('text=Đặt lịch thành công')).toBeVisible();
  });
});
