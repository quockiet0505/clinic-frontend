import axiosInstance from '@/config/axios';
import { Medicine, PrescriptionUI } from '../types/pharmacy';

export const pharmacyApi = {
  // Medicine
  getMedicines: async (): Promise<Medicine[]> => {
    try {
      const res = await axiosInstance.get('/medicines');
      return res.data.data || [];
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
  },

  // Prescription
  getPrescriptions: async (): Promise<PrescriptionUI[]> => {
    try {
      const res = await axiosInstance.get('/prescriptions');
      return res.data.data || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  getPrescriptionById: async (id: number): Promise<PrescriptionUI> => {
    const res = await axiosInstance.get(`/prescriptions/${id}`);
    return res.data.data;
  },
  dispensePrescription: async (id: number): Promise<void> => {
    // Giả sử có API để cập nhật trạng thái đơn thành 'DISPENSED'
    // Nếu chưa có, bạn có thể gọi PUT /prescriptions/{id}/dispense
    await axiosInstance.put(`/prescriptions/${id}/dispense`);
  },
};