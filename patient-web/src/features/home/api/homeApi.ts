import axiosInstance from '@/config/axios';
import { getStaticUrl } from '@/utils/url';

const staticUrl = getStaticUrl();

export const homeApi = {
  getSpecialties: async () => {
    const res = await axiosInstance.get('/expertise/all');
    return res.data.data;
  },

  getDoctors: async () => {
    const res = await axiosInstance.get('/staffs/doctors');
    return res.data.data;
  },

  getFeaturedDoctors: async () => {
    const res = await axiosInstance.get('/staffs/doctors/featured');
    return res.data.data;
  },

  getServices: async () => {
    const res = await axiosInstance.get('/services/all', { params: { bookableOnly: true } });
    return res.data.data;
  },

  getFeaturedServices: async () => {
    const res = await axiosInstance.get('/services/featured', { params: { bookableOnly: true } });
    return res.data.data;
  },

  getQuickActions: async () => {
    try {
      const res = await axiosInstance.get('/public/quick-actions');
      if (!res.data || !res.data.data) return [];
      // Ghép staticUrl cho iconUrl của từng action
      const actions = res.data.data.map((action: any) => ({
        ...action,
        iconUrl: `${staticUrl}${action.iconUrl}`
      }));
      return actions;
    } catch (e) {
      console.error('Failed to get quick actions', e);
      return [];
    }
  },

  getLogo: async () => {
    try {
      const res = await axiosInstance.get('/public/logos/main');
      return res.data && res.data.data ? `${staticUrl}${res.data.data.imageUrl}` : '/images/logo.png';
    } catch {
      return '/images/logo.png';
    }
  },

  getBanner: async (key: string = 'main') => {
    try {
      const res = await axiosInstance.get(`/public/banners/${key}`);
      return res.data && res.data.data ? `${staticUrl}${res.data.data.imageUrl}` : `/images/banners/${key === 'doctor' ? 'doctor.webp' : key === 'service' ? 'service.webp' : 'hero-banner.jpg'}`;
    } catch {
      return `/images/banners/${key === 'doctor' ? 'doctor.webp' : key === 'service' ? 'service.webp' : 'hero-banner.jpg'}`;
    }
  },

  submitContactMessage: async (data: { fullName: string; phone: string; email?: string; subject?: string; content: string }) => {
    const res = await axiosInstance.post('/contact-messages', data, {
      toastSuccess: 'Đã gửi tin nhắn liên hệ thành công',
    });
    return res.data;
  },

  getSystemSettings: async () => {
    const res = await axiosInstance.get('/settings');
    return res.data.data;
  },
};