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

  // Doctor Prices
  getDoctorPrices: async () => {
    try {
      const res = await axiosInstance.get('/doctor-prices');
      return res.data.data;
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  createOrUpdateDoctorPrice: async (data: any) => axiosInstance.post('/doctor-prices', data),
  deleteDoctorPrice: async (id: number) => axiosInstance.delete(`/doctor-prices/${id}`),

  // Roles
  getRoles: async () => {
    try {
      const res = await axiosInstance.get('/roles');
      return res.data.data;
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  createRole: async (data: any) => axiosInstance.post('/roles', data),
  updateRole: async (id: number, data: any) => axiosInstance.put(`/roles/${id}`, data),
  deleteRole: async (id: number) => axiosInstance.delete(`/roles/${id}`),

  // General Settings
  getGeneralSettings: async () => {
    try {
      const res = await axiosInstance.get('/settings');
      return res.data.data;
    } catch (e) {
      console.error(e);
      return {};
    }
  },
  updateGeneralSettings: async (data: any) => axiosInstance.post('/settings', data),
};
