import axiosInstance from '@/config/axios';
import { Feedback, AppNotification } from '../types/crm';

export const crmApi = {
  // ===== FEEDBACK =====

  // Lấy danh sách feedback cho phòng khám (bảng feedback)
  getClinicFeedbacks: async (params?: {
    search?: string;
    rating?: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<Feedback[]> => {
    try {
      const res = await axiosInstance.get('/feedbacks/clinic', { params });
      return res.data.data || [];
    } catch (error) {
      console.error('Lỗi lấy feedback phòng khám:', error);
      return [];
    }
  },

  // Lấy danh sách feedback cho bác sĩ (bảng doctor_review)
  getDoctorFeedbacks: async (params?: {
    search?: string;
    rating?: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<Feedback[]> => {
    try {
      const res = await axiosInstance.get('/feedbacks/doctor', { params });
      return res.data.data || [];
    } catch (error) {
      console.error('Lỗi lấy feedback bác sĩ:', error);
      return [];
    }
  },

  // Phản hồi feedback (phòng khám)
  replyClinicFeedback: async (feedbackId: number, reply: string): Promise<void> => {
    await axiosInstance.post(`/feedbacks/clinic/${feedbackId}/reply`, { reply });
  },

  // Phản hồi feedback (bác sĩ)
  replyDoctorFeedback: async (reviewId: number, reply: string): Promise<void> => {
    await axiosInstance.post(`/feedbacks/doctor/${reviewId}/reply`, { reply });
  },

  // ===== NOTIFICATION =====

  getNotifications: async (params?: {
    search?: string;
    type?: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<AppNotification[]> => {
    try {
      const res = await axiosInstance.get('/notifications', { params });
      return res.data.data || [];
    } catch (error) {
      console.error('Lỗi lấy notification:', error);
      return [];
    }
  },

  createNotification: async (data: { type: 'EMAIL' | 'SYSTEM'; content: string; accountId?: number }): Promise<void> => {
    await axiosInstance.post('/notifications', data);
  },
};