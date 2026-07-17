// features/profile/api/profileApi.ts
import axiosInstance from '@/config/axios';
import { UserProfile } from '../types/profile';

export const profileApi = {
  getMyProfile: async (): Promise<UserProfile> => {
    const res = await axiosInstance.get('/profile/me', { skipToast: true });
    return res.data.data;
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const res = await axiosInstance.put('/profile/me', data, {
      toastSuccess: 'Cập nhật thông tin thành công',
    });
    return res.data.data;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await axiosInstance.post(
      '/profile/change-password',
      { currentPassword, newPassword },
      { toastSuccess: 'Đổi mật khẩu thành công' }
    );
  },

  uploadAvatar: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axiosInstance.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.data;
  },
};