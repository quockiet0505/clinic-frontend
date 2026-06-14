import axiosInstance from '@/config/axios';

export const logoApi = {
  getLogo: async (key: string = 'main') => {
    try {
      const res = await axiosInstance.get(`/public/logos/${key}`);
      return res.data.data;
    } catch (e) {
      console.error('Failed to fetch logo', e);
      return null;
    }
  }
};
