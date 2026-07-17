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

    const response = await axiosInstance.get<ApiResponse<PatientProfile>>('/patients/profile', {
      skipToast: true,
    });

    return response.data.data;
  },

  updateMyProfile: async (
    data: UpdateProfilePayload,
  ): Promise<{ message: string }> => {

    const response = await axiosInstance.put<ApiResponse<unknown>>('/patients/profile', data, {
      toastSuccess: 'Cập nhật thông tin thành công',
    });

    return {
      message: response.data.message,
    };
  },

  changePassword: async (
    data: ChangePasswordRequest,
  ): Promise<{ message: string }> => {

    const response = await axiosInstance.put<ApiResponse<unknown>>('/auth/change-password', data, {
      toastSuccess: 'Đổi mật khẩu thành công',
    });

    return {
      message: response.data.message,
    };
  },

  uploadAvatar: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axiosInstance.post<ApiResponse<string>>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.data;
  },
};