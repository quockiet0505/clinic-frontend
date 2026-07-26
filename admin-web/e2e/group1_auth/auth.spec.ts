import { test, expect } from '@playwright/test';

test.describe('Nhóm 1: Đăng nhập Admin Web', () => {

  test('TC01-08: Admin đăng nhập thành công', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('admin@clinic.vn').fill('admin@gmail.com');
    await page.getByPlaceholder('e.g., Trustcare@2026').fill('12345678');
    await page.getByRole('button', { name: 'Đăng nhập vào hệ thống' }).click();
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByText('Hệ thống quản lý phòng khám')).toBeVisible();
  });

  test('TC01-15: Nhân viên truy cập chức năng không thuộc vai trò', async ({ page }) => {
    // Đăng nhập bằng tài khoản Lễ tân
    await page.goto('/login');
    await page.getByPlaceholder('admin@clinic.vn').fill('receptionist@clinic.com');
    await page.getByPlaceholder('e.g., Trustcare@2026').fill('12345678');
    await page.getByRole('button', { name: 'Đăng nhập vào hệ thống' }).click();
    await page.waitForURL(/.*dashboard/);
    
    // Cố tình truy cập trang Báo cáo Doanh thu (chỉ dành cho Admin)
    await page.goto('/staffs');
    
    // Hệ thống chặn truy cập
    await expect(page.getByText('403')).toBeVisible();
  });

});
