// src/features/profile/api/profileApi.ts
import type { PatientProfile, UpdateProfilePayload } from '../types/profile';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const profileApi = {
  // Fetch current user profile
  getProfile: async (): Promise<PatientProfile> => {
    await delay(800);
    // Simulate fetching from DB based on current logged in user
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    return {
      id: 1,
      accountId: 101,
      email: user?.email || 'benhnhan@gmail.com',
      fullName: user?.fullName || 'Nguyễn Văn Bệnh Nhân',
      phone: user?.phone || '0901234567',
      gender: 'MALE',
      dateOfBirth: '1990-05-15',
      address: '71-73 Ngô Thời Nhiệm, Phường Võ Thị Sáu, Quận 3, TP.HCM',
    };
  },

  // Update profile data in 'patient' table
  updateProfile: async (data: UpdateProfilePayload): Promise<{ success: boolean; message: string }> => {
    await delay(1000);
    
    // Update local storage to reflect changes immediately in Header
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      localStorage.setItem('user', JSON.stringify({ ...user, fullName: data.fullName, phone: data.phone }));
    }
    
    return { success: true, message: 'Cập nhật hồ sơ thành công!' };
  },

  // Update password in 'account' table
  changePassword: async (oldPass: string, newPass: string): Promise<{ success: boolean; message: string }> => {
    await delay(1000);
    if (oldPass !== '123456') { // Mock check old password
      throw new Error('Mật khẩu hiện tại không chính xác!');
    }
    return { success: true, message: 'Đổi mật khẩu thành công!' };
  }
};