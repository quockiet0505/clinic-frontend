import axiosInstance from '@/config/axios';
import type { ApiResponse } from '@/config/api';
import type { FollowUp } from '../types/appointment';

export const followUpApi = {
  getAll: async (): Promise<FollowUp[]> => {
    const response = await axiosInstance.get<ApiResponse<FollowUp[]>>('/follow-ups');
    const { success, message, data } = response.data;
    if (!success) {
      throw new Error(message || 'Failed to fetch follow-ups');
    }
    return data;
  },

  updateStatus: async (id: number, status: string): Promise<FollowUp> => {
    const response = await axiosInstance.patch<ApiResponse<FollowUp>>(`/follow-ups/${id}/status`, null, {
      params: { status }
    });
    const { success, message, data } = response.data;
    if (!success) {
      throw new Error(message || 'Failed to update follow-up status');
    }
    return data;
  }
};
