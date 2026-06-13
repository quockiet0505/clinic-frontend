import axiosInstance from '@/config/axios';
import { Medicine } from '../types/pharmacy';

export const pharmacyApi = {
  getMedicines: async (): Promise<Medicine[]> => {
    try {
      const res = await axiosInstance.get('/medicines');
      return res.data.data;
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  createMedicine: async (data: Omit<Medicine, 'medicineId' | 'quantity'>): Promise<void> => {
    await axiosInstance.post('/medicines', data);
  },

  updateMedicine: async (id: number, data: Partial<Medicine>): Promise<void> => {
    await axiosInstance.put(`/medicines/${id}`, data);
  },

  deleteMedicine: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/medicines/${id}`);
  }
};
