import axiosInstance from '@/config/axios';

export interface NotificationItem {
  id: number;
  type: 'EMAIL' | 'SYSTEM' | string;
  subject: string;
  content: string;
  sentAt: string;
}

export const notificationApi = {
  getMyNotifications: async (): Promise<NotificationItem[]> => {
    const response = await axiosInstance.get<{ data: NotificationItem[] }>('/notifications/my');
    return response.data.data;
  },
};
