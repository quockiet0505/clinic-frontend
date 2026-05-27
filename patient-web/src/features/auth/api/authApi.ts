import axiosInstance from '@/config/axios';
import type { RegisterRequest, AuthResponse } from '../types/auth';

export const authApi = {
  login: async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
  
    const response = await axiosInstance.post(
      '/auth/patient/login',
      {
        email,
        password,
      }
    );
  
    console.log('LOGIN RESPONSE:', response.data);
  
    localStorage.setItem(
      'token',
      response.data.token
    );
  
    return response.data;
  },
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/patient/register', data);
    return response.data;
  },
  logout: async () => {
    await axiosInstance.post('/auth/logout');
  },
  getCurrentUser: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data; // { accountId, email, roles }
  },
};