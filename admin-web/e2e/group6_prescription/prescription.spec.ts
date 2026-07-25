import { test, expect } from '@playwright/test';

test.describe('Nhóm 6: Kê đơn (Admin Web)', () => {
  test('TC 6.1: Bác sĩ kê đơn và cảnh báo tương tác thuốc', async ({ page }) => {
    await page.goto('/login');
    // ... login doctor ...
    await page.goto('/prescriptions');
    await page.fill('input[placeholder="Tìm thuốc..."]', 'Paracetamol');
    await page.click('button:has-text("Thêm")');
    await page.fill('input[placeholder="Tìm thuốc..."]', 'Warfarin');
    await page.click('button:has-text("Thêm")');
    await expect(page.locator('text=Cảnh báo tương tác thuốc')).toBeVisible();
  });
});
