import axiosInstance from '@/config/axios';

export const homeApi = {

  getSpecialties: async () => {
    const res = await axiosInstance.get('/expertise');
    return res.data.data;
  },

  getDoctors: async () => {
    const res = await axiosInstance.get('/staffs/doctors');
    return res.data.data;
  },

  getServices: async () => {
    const res = await axiosInstance.get('/services');
    return res.data.data;
  },

  getQuickActions: async () => {
    const res = await axiosInstance.get('/static/quick-actions');
    return res.data.data;
  },

  getLogo: async () => {
    const res = await axiosInstance.get('/static/logo');
    return res.data.data.logoUrl;
  },

  getBanner: async () => {
    const res = await axiosInstance.get('/static/banner');
    return res.data.data.bannerUrl;
  },
};