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
    password: string,
    rememberMe: boolean = true
  ): Promise<AuthResponse> => {

    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      '/auth/patient/login',
      { email, password },
      { toastSuccess: 'Đăng nhập thành công' }
    );

    const apiResponse = response.data;

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(
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

  googleLogin: async (idToken: string): Promise<any> => {
    try {
      const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
        '/auth/google/login',
        { idToken },
        { toastSuccess: 'Đăng nhập Google thành công' }
      );
      return { success: true, data: response.data.data };
    } catch (error: any) {
      if (error.response?.status === 404 && error.response?.data?.message === 'REQUIRES_REGISTRATION') {
        return { 
          requiresRegistration: true, 
          data: error.response.data.data 
        };
      }
      throw error;
    }
  },

  googleRegister: async (
    fullName: string,
    phone: string,
    email: string,
    idToken: string
  ): Promise<AuthResponse> => {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      '/auth/google/register',
      { fullName, phone, email, idToken },
      { toastSuccess: 'Đăng ký tài khoản Google thành công' }
    );
    return response.data.data;
  },

  logout: async () => {
    await axiosInstance.post('/auth/logout');
  },

  getCurrentUser: async () => {

    const response = await axiosInstance.get(
      '/auth/me',
      { skipToast: true }
    );

    return response.data.data;
  },
};