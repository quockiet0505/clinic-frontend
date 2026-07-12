import axiosInstance from '@/config/axios';
import type { LoginResponse, User } from '../types/auth';

// Định nghĩa response từ backend (dùng ApiResponse wrapper)
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface StaffLoginData {
  accountId: number;
  email: string;
  token: string;
  roles: string[];
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await axiosInstance.post<ApiResponse<StaffLoginData>>('/auth/staff/login', { email, password });
    const { success, message, data } = response.data;
    if (!success) {
      throw new Error(message);
    }
    let role: User['role'] = 'RECEPTIONIST';
    if (data.roles.includes('ROLE_ADMIN')) role = 'ADMIN';
    else if (data.roles.includes('ROLE_DOCTOR')) role = 'DOCTOR';
    else if (data.roles.includes('ROLE_LAB_TECH')) role = 'LAB_TECH';
    else if (data.roles.includes('ROLE_RECEPTIONIST')) role = 'RECEPTIONIST';
    else if (data.roles.includes('ROLE_NURSE')) role = 'NURSE';
    
    const user: User = {
      id: data.accountId.toString(),
      email: data.email,
      fullName: data.email.split('@')[0], 
      role: role,
      roles: data.roles,
    };
    return { user, token: data.token };
  },

  googleLogin: async (idToken: string): Promise<LoginResponse> => {
    try {
      const response = await axiosInstance.post<ApiResponse<StaffLoginData>>('/auth/google/login', { idToken });
      const { success, message, data } = response.data;
      if (!success) {
        throw new Error(message);
      }

      const isStaff = data.roles.includes('ROLE_ADMIN') || 
                      data.roles.includes('ROLE_DOCTOR') || 
                      data.roles.includes('ROLE_RECEPTIONIST') || data.roles.includes('ROLE_NURSE') || 
                      data.roles.includes('ROLE_LAB_TECH') ||
                      data.roles.includes('ROLE_RECEPTIONIST') ||
                      data.roles.includes('ROLE_NURSE');
                      
      if (!isStaff) {
        throw new Error('Access Denied: Staff privileges required.');
      }

      let role: User['role'] = 'RECEPTIONIST';
      if (data.roles.includes('ROLE_ADMIN')) role = 'ADMIN';
      else if (data.roles.includes('ROLE_DOCTOR')) role = 'DOCTOR';
      else if (data.roles.includes('ROLE_LAB_TECH')) role = 'LAB_TECH';
      else if (data.roles.includes('ROLE_RECEPTIONIST')) role = 'RECEPTIONIST';
      else if (data.roles.includes('ROLE_NURSE')) role = 'NURSE';

      const user: User = {
        id: data.accountId.toString(),
        email: data.email,
        fullName: data.email.split('@')[0], 
        role: role,
        roles: data.roles,
      };
      
      return { user, token: data.token };
    } catch (error: any) {
      if (error.response?.status === 404 && error.response?.data?.message === 'REQUIRES_REGISTRATION') {
        throw new Error('Access Denied: Account not registered as staff.');
      }
      throw error;
    }
  },
};