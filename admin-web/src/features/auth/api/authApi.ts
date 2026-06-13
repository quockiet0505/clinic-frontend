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
    // Xác định role từ mảng roles
    let role: User['role'] = 'STAFF';
    if (data.roles.includes('ROLE_ADMIN')) role = 'ADMIN';
    else if (data.roles.includes('ROLE_DOCTOR')) role = 'DOCTOR';
    else if (data.roles.includes('ROLE_LAB_TECH')) role = 'LAB_TECH';
    
    const user: User = {
      id: data.accountId.toString(),
      email: data.email,
      fullName: data.email.split('@')[0], 
      role: role,
      roles: data.roles,
    };
    return { user, token: data.token };
  },
};