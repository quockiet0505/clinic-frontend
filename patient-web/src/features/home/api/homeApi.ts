import axiosInstance from '@/config/axios';

export const homeApi = {
  getSpecialties: async () => {
    const res = await axiosInstance.get('/expertise');
    return res.data;
  },
  getDoctors: async () => {
    const res = await axiosInstance.get('/staffs/doctors');
    return res.data;
  },
  getServices: async () => {
    const res = await axiosInstance.get('/services');
    return res.data;
  },
  getQuickActions: async () => {
    const res = await axiosInstance.get('/static/quick-actions');
    return res.data;
  },
  getLogo: async () => {
    const res = await axiosInstance.get('/static/logo');
    return res.data.logoUrl;
  },
  getBanner: async () => {
    const res = await axiosInstance.get('/static/banner');
    return res.data.bannerUrl;
  },
};