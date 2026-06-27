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

const normalizeDoctorPrice = (item: DoctorPricing & { finalPrice?: unknown; originalPrice?: unknown; discountPrice?: unknown }): DoctorPricing => ({
  ...item,
  originalPrice: toNumber(item.originalPrice),
  discountPrice: item.discountPrice != null ? toNumber(item.discountPrice) : undefined,
  finalPrice: item.finalPrice != null ? toNumber(item.finalPrice) : undefined,
  price: toNumber(item.finalPrice ?? item.discountPrice ?? item.originalPrice ?? item.price),
});

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

  createExpertise: async (data: unknown) =>
    axiosInstance.post('/expertise', data, { toastSuccess: 'Thêm chuyên khoa thành công' }),
  updateExpertise: async (id: number, data: unknown) =>
    axiosInstance.put(`/expertise/${id}`, data, { toastSuccess: 'Cập nhật chuyên khoa thành công' }),
  deleteExpertise: async (id: number) =>
    axiosInstance.delete(`/expertise/${id}`, { toastSuccess: 'Xóa chuyên khoa thành công' }),

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

  createService: async (data: unknown) =>
    axiosInstance.post('/services', data, { toastSuccess: 'Thêm dịch vụ thành công' }),
  updateService: async (id: number, data: unknown) =>
    axiosInstance.put(`/services/${id}`, data, { toastSuccess: 'Cập nhật dịch vụ thành công' }),
  deleteService: async (id: number) =>
    axiosInstance.delete(`/services/${id}`, { toastSuccess: 'Xóa dịch vụ thành công' }),

  getDoctorPricesPaged: async (params?: SettingsQueryParams) => {
    try {
      const res = await axiosInstance.get('/doctor-prices', { params });
      const parsed = parsePagedResponse<DoctorPricing>(res.data);
      return {
        content: parsed.content.map(normalizeDoctorPrice),
        totalElements: parsed.totalElements,
      };
    } catch (e) {
      console.error(e);
      return { content: [], totalElements: 0 };
    }
  },

  createOrUpdateDoctorPrice: async (data: unknown) =>
    axiosInstance.post('/doctor-prices', data, { toastSuccess: 'Lưu phí khám thành công' }),
  deleteDoctorPrice: async (id: number) =>
    axiosInstance.delete(`/doctor-prices/${id}`, { toastSuccess: 'Xóa phí khám thành công' }),

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

  createRole: async (data: unknown) =>
    axiosInstance.post('/roles', data, { toastSuccess: 'Thêm vai trò thành công' }),
  updateRole: async (id: number, data: unknown) =>
    axiosInstance.put(`/roles/${id}`, data, { toastSuccess: 'Cập nhật vai trò thành công' }),
  deleteRole: async (id: number) =>
    axiosInstance.delete(`/roles/${id}`, { toastSuccess: 'Xóa vai trò thành công' }),

  getGeneralSettings: async () => {
    try {
      const res = await axiosInstance.get('/settings');
      return res.data.data;
    } catch (e) {
      console.error(e);
      return {};
    }
  },

  updateGeneralSettings: async (data: unknown) =>
    axiosInstance.post('/settings', data, { toastSuccess: 'Đã lưu cấu hình chung thành công' }),
};
