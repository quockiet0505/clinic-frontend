import axiosInstance from '@/config/axios';
import { BaseFilterParams } from '@/types/common';
import { parsePagedResponse } from '@/utils/pagedApi';
import { ServiceOrder, ServiceResult } from '../types/laboratory';

interface ServiceOrderQueryParams extends BaseFilterParams {
  status?: string;
  sortBy?: string;
  sortDir?: string;
}

interface ServiceResultQueryParams extends BaseFilterParams {
  status?: string;
  sortBy?: string;
  sortDir?: string;
}

export const laboratoryApi = {
  getServiceOrdersPaged: async (
    params?: ServiceOrderQueryParams
  ): Promise<{ content: ServiceOrder[]; totalElements: number }> => {
    try {
      const res = await axiosInstance.get('/service-orders', { params });
      return parsePagedResponse<ServiceOrder>(res.data);
    } catch (e) {
      console.error('getServiceOrdersPaged failed:', e);
      return { content: [], totalElements: 0 };
    }
  },

  getLabResultsPaged: async (
    params?: ServiceResultQueryParams
  ): Promise<{ content: ServiceResult[]; totalElements: number }> => {
    try {
      const res = await axiosInstance.get('/service-results', { params });
      return parsePagedResponse<ServiceResult>(res.data);
    } catch (e) {
      console.error('getLabResultsPaged failed:', e);
      return { content: [], totalElements: 0 };
    }
  },

  updateOrderStatus: async (id: number, status: string, reason?: string): Promise<void> => {
    await axiosInstance.patch(`/service-orders/${id}/status`, null, { params: { status, rejectionReason: reason } });
  },

  submitResult: async (data: unknown): Promise<void> => {
    await axiosInstance.post('/service-results', data);
  },
};
