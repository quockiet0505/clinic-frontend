import axiosInstance from '@/config/axios';

export const settingsApi = {
  // Expertise
  getExpertises: async () => {
    try {
      const res = await axiosInstance.get('/expertise');
      return res.data.data;
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  createExpertise: async (data: any) => axiosInstance.post('/expertise', data),
  updateExpertise: async (id: number, data: any) => axiosInstance.put(`/expertise/${id}`, data),
  deleteExpertise: async (id: number) => axiosInstance.delete(`/expertise/${id}`),

  // Services
  getServices: async () => {
    try {
      const res = await axiosInstance.get('/services');
      return res.data.data;
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  createService: async (data: any) => axiosInstance.post('/services', data),
  updateService: async (id: number, data: any) => axiosInstance.put(`/services/${id}`, data),
  deleteService: async (id: number) => axiosInstance.delete(`/services/${id}`),
};
