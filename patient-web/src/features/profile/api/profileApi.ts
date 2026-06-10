import axiosInstance from '@/config/axios';

import type {
  ChangePasswordRequest,
  PatientProfile,
  UpdateProfilePayload,
} from '../types/profile';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const profileApi = {

  getMyProfile: async (): Promise<PatientProfile> => {

    const response = await axiosInstance.get<
      ApiResponse<PatientProfile>
    >('/patients/profile');

    return response.data.data;
  },

  updateMyProfile: async (
    data: UpdateProfilePayload,
  ): Promise<{ message: string }> => {

    const response = await axiosInstance.put<
      ApiResponse<unknown>
    >('/patients/profile', data);

    return {
      message: response.data.message,
    };
  },

  changePassword: async (
    data: ChangePasswordRequest,
  ): Promise<{ message: string }> => {

    const response = await axiosInstance.put<
      ApiResponse<unknown>
    >('/auth/change-password', data);

    return {
      message: response.data.message,
    };
  },
};