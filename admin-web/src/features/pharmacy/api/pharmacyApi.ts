import axiosInstance from '@/config/axios';
import { BaseFilterParams } from '@/types/common';
import { parsePagedResponse } from '@/utils/pagedApi';
import { Medicine, PrescriptionUI } from '../types/pharmacy';

interface MedicineQueryParams extends BaseFilterParams {
  sortBy?: string;
  sortDir?: string;
}

interface PrescriptionQueryParams extends BaseFilterParams {
  status?: string;
  sortBy?: string;
  sortDir?: string;
}

export const pharmacyApi = {
  getMedicinesPaged: async (
    params?: MedicineQueryParams
  ): Promise<{ content: Medicine[]; totalElements: number }> => {
    try {
      const res = await axiosInstance.get('/medicines', { params });
      return parsePagedResponse<Medicine>(res.data);
    } catch (e) {
      console.error(e);
      return { content: [], totalElements: 0 };
    }
  },

  getMedicines: async (): Promise<Medicine[]> => {
    try {
      const res = await axiosInstance.get('/medicines/all');
      return res.data.data || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  searchMedicines: async (keyword: string): Promise<Medicine[]> => {
    try {
      const res = await axiosInstance.get('/medicines', { params: { search: keyword, size: 50 } });
      return res.data.data?.content || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  createMedicine: async (data: Omit<Medicine, 'medicineId' | 'quantity'>): Promise<void> => {
    await axiosInstance.post('/medicines', data, { toastSuccess: 'Thêm thuốc mới thành công' });
  },

  updateMedicine: async (id: number, data: Partial<Medicine>): Promise<void> => {
    await axiosInstance.put(`/medicines/${id}`, data, { toastSuccess: 'Cập nhật thuốc thành công' });
  },

  deleteMedicine: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/medicines/${id}`, { toastSuccess: 'Xóa thuốc thành công' });
  },

  getPrescriptionsPaged: async (
    params?: PrescriptionQueryParams
  ): Promise<{ content: PrescriptionUI[]; totalElements: number }> => {
    try {
      const res = await axiosInstance.get('/prescriptions', { params });
      return parsePagedResponse<PrescriptionUI>(res.data);
    } catch (e) {
      console.error(e);
      return { content: [], totalElements: 0 };
    }
  },

  getPrescriptionById: async (id: number): Promise<PrescriptionUI> => {
    const res = await axiosInstance.get(`/prescriptions/${id}`);
    return res.data.data;
  },

  dispensePrescription: async (id: number): Promise<void> => {
    await axiosInstance.put(`/prescriptions/${id}/dispense`, undefined, {
      toastSuccess: 'Đã cấp phát thuốc thành công',
    });
  },
};
