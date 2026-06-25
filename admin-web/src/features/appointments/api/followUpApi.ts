import axiosInstance from '@/config/axios';
import type { ApiResponse } from '@/config/api';
import { BaseFilterParams } from '@/types/common';
import { parsePagedResponse } from '@/utils/pagedApi';
import type { FollowUp, FollowUpCreateRequest } from '../types/appointment';

interface FollowUpQueryParams extends BaseFilterParams {
  status?: string;
  tab?: string;
  sortBy?: string;
  sortDir?: string;
}

export const followUpApi = {
  getAllPaged: async (params?: FollowUpQueryParams): Promise<{ content: FollowUp[]; totalElements: number }> => {
    try {
      const response = await axiosInstance.get('/follow-ups', { params, skipToast: true });
      return parsePagedResponse<FollowUp>(response.data);
    } catch (error) {
      console.error('Error fetching paged follow-ups:', error);
      return { content: [], totalElements: 0 };
    }
  },

  create: async (data: FollowUpCreateRequest): Promise<FollowUp> => {
    const response = await axiosInstance.post<ApiResponse<FollowUp>>('/follow-ups', data, {
      toastSuccess: 'Đã hẹn tái khám và gửi thông báo',
    });
    const { success, message, data: result } = response.data;
    if (!success || !result) {
      throw new Error(message || 'Failed to create follow-up');
    }
    return result;
  },

  updateStatus: async (id: number, status: string, cancelReason?: string): Promise<FollowUp> => {
    const response = await axiosInstance.patch<ApiResponse<FollowUp>>(`/follow-ups/${id}/status`, null, {
      params: { status, cancelReason },
      toastSuccess: 'Đã cập nhật trạng thái tái khám',
    });
    const { success, message, data } = response.data;
    if (!success) {
      throw new Error(message || 'Failed to update follow-up status');
    }
    return data;
  },

  linkAppointment: async (id: number, appointmentId: number): Promise<FollowUp> => {
    const response = await axiosInstance.patch<ApiResponse<FollowUp>>(
      `/follow-ups/${id}/appointment/${appointmentId}`
    );
    const { success, message, data } = response.data;
    if (!success) {
      throw new Error(message || 'Failed to link follow-up to appointment');
    }
    return data;
  },
};
