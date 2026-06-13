import axiosInstance from '@/config/axios';
import { Patient } from '../types/patient';

export const patientApi = {
  getAll: async (): Promise<Patient[]> => {
    try {
      const res = await axiosInstance.get('/patients');
      return res.data.data;
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  create: async (data: Omit<Patient, 'patientId'>): Promise<void> => {
    await axiosInstance.post('/patients', data);
  },

  update: async (id: number, data: Partial<Patient>): Promise<void> => {
    await axiosInstance.put(`/patients/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/patients/${id}`);
  }
};
