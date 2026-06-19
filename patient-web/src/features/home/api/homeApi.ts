import axiosInstance from '@/config/axios';
import { getStaticUrl } from '@/utils/url';

const staticUrl = getStaticUrl();

export const homeApi = {
  getSpecialties: async () => {
    const res = await axiosInstance.get('/expertise');
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
    const res = await axiosInstance.get('/services');
    return res.data.data;
  },

  getFeaturedServices: async () => {
    const res = await axiosInstance.get('/services/featured');
    return res.data.data;
  },

  getQuickActions: async () => {
    const res = await axiosInstance.get('/public/quick-actions');
    // Ghép staticUrl cho iconUrl của từng action
    const actions = res.data.data.map((action: any) => ({
      ...action,
      iconUrl: `${staticUrl}${action.iconUrl}`
    }));
    return actions;
  },

  getLogo: async () => {
    const res = await axiosInstance.get('/public/logos/main');
    return `${staticUrl}${res.data.data.imageUrl}`;
  },

  getBanner: async (key: string = 'main') => {
    const res = await axiosInstance.get(`/public/banners/${key}`);
    return `${staticUrl}${res.data.data.imageUrl}`;
  },
};