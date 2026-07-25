import { test, expect } from '@playwright/test';

test.describe('Nhóm 4: Lễ tân (Admin Web)', () => {
  test('TC 4.1: Lễ tân check-in bệnh nhân', async ({ page }) => {
    await page.goto('/login');
    // ... logic login receptionist ...
    await page.goto('/reception');
    await page.click('button:has-text("Check-in")');
    await expect(page.locator('text=Check-in thành công')).toBeVisible();
  });
});
