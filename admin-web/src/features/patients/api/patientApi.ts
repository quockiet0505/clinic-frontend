import axiosInstance from '@/config/axios';
import { BaseFilterParams } from '@/types/common';
import { parsePagedResponse } from '@/utils/pagedApi';
import { Patient } from '../types/patient';

interface PatientQueryParams extends BaseFilterParams {
  gender?: string;
  sortBy?: string;
  sortDir?: string;
}

export const patientApi = {
  getAllPaged: async (params?: PatientQueryParams): Promise<{ content: Patient[]; totalElements: number }> => {
    try {
      const res = await axiosInstance.get('/patients', { params });
      return parsePagedResponse<Patient>(res.data);
    } catch (e) {
      console.error(e);
      return { content: [], totalElements: 0 };
    }
  },

  getById: async (id: number): Promise<Patient | null> => {
    try {
      const res = await axiosInstance.get(`/patients/${id}`);
      return res.data.data;
    } catch (e) {
      console.error(e);
      return null;
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
  },
};
