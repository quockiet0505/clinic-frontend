import axiosInstance from '@/config/axios';

import type {
  ChangePasswordRequest,
  PatientProfile,
  UpdateProfilePayload,
} from '../types/profile';

export const profileApi = {
  getMyProfile: async (): Promise<PatientProfile> => {
    const response = await axiosInstance.get(
      '/patients/profile',
    );

    return response.data;
  },

  updateMyProfile: async (
    data: UpdateProfilePayload,
  ): Promise<{ message: string }> => {
    const response = await axiosInstance.put(
      '/patients/profile',
      data,
    );

    return response.data;
  },

  changePassword: async (
    data: ChangePasswordRequest,
  ): Promise<{ message: string }> => {
    const response = await axiosInstance.put(
      '/account/change-password',
      data,
    );

    return response.data;
  },
};