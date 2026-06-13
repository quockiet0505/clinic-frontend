import axiosInstance from '@/config/axios';
import { Staff } from '../types/staff';

export const staffApi = {
  getAll: async (): Promise<Staff[]> => {
    try {
      const res = await axiosInstance.get('/staffs');
      return res.data.data;
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  create: async (data: Omit<Staff, 'staff_id'>): Promise<void> => {
    await axiosInstance.post('/staffs', data);
  },

  update: async (id: number, data: Partial<Staff>): Promise<void> => {
    await axiosInstance.put(`/staffs/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/staffs/${id}`);
  }
};
