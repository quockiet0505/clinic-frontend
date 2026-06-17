// features/staff/api/staffApi.ts
import axiosInstance from '@/config/axios';
import { Staff, LeaveRequest } from '../types/staff';

export const staffApi = {
  getAll: async (): Promise<Staff[]> => {
    const res = await axiosInstance.get('/staffs');
    return res.data.data;
  },

  create: async (data: Omit<Staff, 'staffId'>): Promise<void> => {
    await axiosInstance.post('/staffs', data);
  },

  update: async (id: number, data: Partial<Staff>): Promise<void> => {
    await axiosInstance.put(`/staffs/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/staffs/${id}`);
  },

  getLeaveRequests: async (): Promise<LeaveRequest[]> => {
    const res = await axiosInstance.get('/leave-requests');
    return res.data.data;
  },

  cancelLeaveRequest: async (leaveId: number): Promise<void> => {
    await axiosInstance.delete(`/leave-requests/${leaveId}`);
  },
};