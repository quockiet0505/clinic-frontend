import axiosInstance from '@/config/axios';
import type { RegisterRequest, AuthResponse } from '../types/auth';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const authApi = {
  login: async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {

    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      '/auth/patient/login',
      { email, password },
      { toastSuccess: 'Đăng nhập thành công' }
    );

    const apiResponse = response.data;

    localStorage.setItem(
      'token',
      apiResponse.data.token
    );

    return apiResponse.data;
  },

  register: async (
    data: RegisterRequest
  ): Promise<AuthResponse> => {

    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      '/auth/patient/register',
      data,
      { toastSuccess: 'Đăng ký tài khoản thành công' }
    );

    return response.data.data;
  },

  logout: async () => {
    await axiosInstance.post('/auth/logout');
  },

  getCurrentUser: async () => {

    const response = await axiosInstance.get(
      '/auth/me'
    );

    return response.data.data;
  },
};