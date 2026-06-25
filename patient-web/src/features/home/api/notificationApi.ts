import axiosInstance from '@/config/axios';
import type { ApiResponse } from '@/config/api';

export interface NotificationItem {
  id: number;
  type: 'EMAIL' | 'SYSTEM' | string;
  subject: string;
  content: string;
  sentAt: string;
}

export const notificationApi = {
  getMyNotifications: async (): Promise<NotificationItem[]> => {
    const response = await axiosInstance.get<ApiResponse<NotificationItem[]>>('/notifications/my', {
      skipToast: true,
    });
    return response.data.data ?? [];
  },
};
