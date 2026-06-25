import axiosInstance from '@/config/axios';
import { BaseFilterParams } from '@/types/common';
import { parsePagedResponse } from '@/utils/pagedApi';
import { Feedback, AppNotification } from '../types/crm';

interface NotificationQueryParams extends BaseFilterParams {
  type?: string;
  sortBy?: string;
  sortDir?: string;
}

interface FeedbackQueryParams extends BaseFilterParams {
  rating?: string | number;
  sortBy?: string;
  sortDir?: string;
}

export const crmApi = {
  getClinicFeedbacksPaged: async (
    params?: FeedbackQueryParams
  ): Promise<{ content: Feedback[]; totalElements: number }> => {
    try {
      const res = await axiosInstance.get('/feedbacks/clinic', { params });
      return parsePagedResponse<Feedback>(res.data);
    } catch (error) {
      console.error('Lỗi lấy feedback phòng khám:', error);
      return { content: [], totalElements: 0 };
    }
  },

  getDoctorFeedbacksPaged: async (
    params?: FeedbackQueryParams
  ): Promise<{ content: Feedback[]; totalElements: number }> => {
    try {
      const res = await axiosInstance.get('/feedbacks/doctor', { params });
      return parsePagedResponse<Feedback>(res.data);
    } catch (error) {
      console.error('Lỗi lấy feedback bác sĩ:', error);
      return { content: [], totalElements: 0 };
    }
  },

  replyClinicFeedback: async (feedbackId: number, reply: string): Promise<void> => {
    await axiosInstance.post(`/feedbacks/clinic/${feedbackId}/reply`, { reply });
  },

  replyDoctorFeedback: async (reviewId: number, reply: string): Promise<void> => {
    await axiosInstance.post(`/feedbacks/doctor/${reviewId}/reply`, { reply });
  },

  getNotificationsPaged: async (
    params?: NotificationQueryParams
  ): Promise<{ content: AppNotification[]; totalElements: number }> => {
    try {
      const res = await axiosInstance.get('/notifications', { params, skipToast: true });
      return parsePagedResponse<AppNotification>(res.data);
    } catch (error) {
      console.error('Lỗi lấy notification:', error);
      return { content: [], totalElements: 0 };
    }
  },

  getNotifications: async (params?: NotificationQueryParams): Promise<AppNotification[]> => {
    try {
      const res = await axiosInstance.get('/notifications/all', { params });
      return res.data.data || [];
    } catch (error) {
      console.error('Lỗi lấy notification:', error);
      return [];
    }
  },

  createNotification: async (data: { type: 'EMAIL' | 'SYSTEM'; content: string; accountId?: number }): Promise<void> => {
    await axiosInstance.post('/notifications', data, { toastSuccess: 'Đã gửi thông báo cho bệnh nhân' });
  },
};
