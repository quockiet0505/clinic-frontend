"use strict";
// import { test, expect } from '@playwright/test';
// 
// test.describe('Nhóm 8: AI Chatbot (Patient Web) - Tương ứng UC13 trong dàn ý', () => {
// 
//   test.beforeEach(async ({ page }) => {
//     // Đăng nhập Bệnh nhân
//     await page.goto('/login');
//     await page.getByPlaceholder('Email hoặc Số điện thoại').fill('patient1@clinic.com');
//     await page.getByPlaceholder('Mật khẩu').fill('12345678');
//     await page.getByRole('button', { name: 'Đăng nhập' }).click();
//     await expect(page).toHaveURL(/.*dashboard/);
//   });
// 
//   test('TC08-01: Bệnh nhân tương tác AI Chatbot để hỏi bệnh', async ({ page }) => {
//     // Mở popup Chatbot bằng cách click vào nút bong bóng Chat ở góc phải dưới
//     // Nút này có chứa ảnh với alt là 'AI Assistant'
//     await page.getByAltText('AI Assistant').click();
//     
//     // Kiểm tra xem header "Trợ lý Y tế AI" đã hiển thị chưa
//     await expect(page.getByText('Trợ lý Y tế AI')).toBeVisible();
// 
//     // Bệnh nhân nhắn tin hỏi triệu chứng
//     await page.getByPlaceholder('Hỏi AI về y tế...').fill('Tôi bị đau dạ dày dữ dội, cần khám gấp');
//     
//     // Bấm nút gửi (Nút submit trong form)
//     await page.locator('form button[type="submit"]').click();
// 
//     // AI phản hồi và gọi Tool
//     // Cần timeout dài hơn vì AI cần thời gian suy nghĩ (Inference + Streaming)
//     await expect(page.getByText('đau dạ dày')).toBeVisible({ timeout: 15000 });
//   });
// 
// });
