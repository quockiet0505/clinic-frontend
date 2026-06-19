import axiosInstance from '@/config/axios';
import type { ApiResponse } from '@/config/api';
import { BaseFilterParams } from '@/types/common';
import { parsePagedResponse } from '@/utils/pagedApi';
import type { FollowUp } from '../types/appointment';

interface FollowUpQueryParams extends BaseFilterParams {
  status?: string;
  tab?: string;
  sortBy?: string;
  sortDir?: string;
}

export const followUpApi = {
  getAllPaged: async (params?: FollowUpQueryParams): Promise<{ content: FollowUp[]; totalElements: number }> => {
    try {
      const response = await axiosInstance.get('/follow-ups', { params });
      return parsePagedResponse<FollowUp>(response.data);
    } catch (error) {
      console.error('Error fetching paged follow-ups:', error);
      return { content: [], totalElements: 0 };
    }
  },

  updateStatus: async (id: number, status: string): Promise<FollowUp> => {
    const response = await axiosInstance.patch<ApiResponse<FollowUp>>(`/follow-ups/${id}/status`, null, {
      params: { status },
    });
    const { success, message, data } = response.data;
    if (!success) {
      throw new Error(message || 'Failed to update follow-up status');
    }
    return data;
  },
};
