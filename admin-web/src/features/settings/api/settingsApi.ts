import axiosInstance from '@/config/axios';
import { BaseFilterParams } from '@/types/common';
import { parsePagedResponse, toNumber } from '@/utils/pagedApi';
import { Role, Service, Expertise, DoctorPricing } from '../types/settings';

const normalizeService = (item: Service & { originalPrice?: unknown; discountPrice?: unknown }): Service => ({
  ...item,
  originalPrice: toNumber(item.originalPrice),
  discountPrice: item.discountPrice != null ? toNumber(item.discountPrice) : undefined,
});

interface SettingsQueryParams extends BaseFilterParams {
  serviceType?: string;
  sortBy?: string;
  sortDir?: string;
}

export const settingsApi = {
  getExpertisesPaged: async (params?: SettingsQueryParams) => {
    try {
      const res = await axiosInstance.get('/expertise', { params });
      return parsePagedResponse<Expertise>(res.data);
    } catch (e) {
      console.error(e);
      return { content: [], totalElements: 0 };
    }
  },

  createExpertise: async (data: unknown) => axiosInstance.post('/expertise', data),
  updateExpertise: async (id: number, data: unknown) => axiosInstance.put(`/expertise/${id}`, data),
  deleteExpertise: async (id: number) => axiosInstance.delete(`/expertise/${id}`),

  getServicesPaged: async (params?: SettingsQueryParams) => {
    try {
      const res = await axiosInstance.get('/services', { params });
      const parsed = parsePagedResponse<Service>(res.data);
      return {
        content: parsed.content.map(normalizeService),
        totalElements: parsed.totalElements,
      };
    } catch (e) {
      console.error('getServicesPaged failed:', e);
      return { content: [], totalElements: 0 };
    }
  },

  createService: async (data: unknown) => axiosInstance.post('/services', data),
  updateService: async (id: number, data: unknown) => axiosInstance.put(`/services/${id}`, data),
  deleteService: async (id: number) => axiosInstance.delete(`/services/${id}`),

  getDoctorPricesPaged: async (params?: SettingsQueryParams) => {
    try {
      const res = await axiosInstance.get('/doctor-prices', { params });
      return parsePagedResponse<DoctorPricing>(res.data);
    } catch (e) {
      console.error(e);
      return { content: [], totalElements: 0 };
    }
  },

  createOrUpdateDoctorPrice: async (data: unknown) => axiosInstance.post('/doctor-prices', data),
  deleteDoctorPrice: async (id: number) => axiosInstance.delete(`/doctor-prices/${id}`),

  getRolesPaged: async (params?: SettingsQueryParams) => {
    try {
      const res = await axiosInstance.get('/roles', { params });
      return parsePagedResponse<Role>(res.data);
    } catch (e) {
      console.error(e);
      return { content: [], totalElements: 0 };
    }
  },

  getRoles: async () => {
    try {
      const res = await axiosInstance.get('/roles/all');
      return res.data.data;
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  createRole: async (data: unknown) => axiosInstance.post('/roles', data),
  updateRole: async (id: number, data: unknown) => axiosInstance.put(`/roles/${id}`, data),
  deleteRole: async (id: number) => axiosInstance.delete(`/roles/${id}`),

  getGeneralSettings: async () => {
    try {
      const res = await axiosInstance.get('/settings');
      return res.data.data;
    } catch (e) {
      console.error(e);
      return {};
    }
  },

  updateGeneralSettings: async (data: unknown) => axiosInstance.post('/settings', data),
};
