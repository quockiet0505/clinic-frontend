import axiosInstance from '@/config/axios';
import { ServiceOrder, ServiceResult } from '../types/laboratory';

export const laboratoryApi = {
  getServiceOrders: async (): Promise<ServiceOrder[]> => {
    try {
      const res = await axiosInstance.get('/service-orders');
      return res.data.data;
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  getLabResults: async (): Promise<ServiceResult[]> => {
    try {
      const res = await axiosInstance.get('/service-results');
      return res.data.data;
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  updateOrderStatus: async (id: number, status: string, reason?: string): Promise<void> => {
    await axiosInstance.patch(`/service-orders/${id}/status`, null, { params: { status, rejectionReason: reason } });
  },
  submitResult: async (data: any): Promise<void> => {
    await axiosInstance.post('/service-results', data);
  }
};