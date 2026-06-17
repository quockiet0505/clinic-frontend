// features/profile/api/profileApi.ts
import axiosInstance from '@/config/axios';
import { UserProfile } from '../types/profile';

export const profileApi = {
  getMyProfile: async (): Promise<UserProfile> => {
    const res = await axiosInstance.get('/profile/me');
    return res.data.data;
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const res = await axiosInstance.put('/profile/me', data);
    return res.data.data;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await axiosInstance.post('/profile/change-password', {
      currentPassword,
      newPassword,
    });
  },
};