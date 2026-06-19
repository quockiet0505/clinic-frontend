import axiosInstance from '@/config/axios';
import { BaseFilterParams } from '@/types/common';
import { parsePagedResponse } from '@/utils/pagedApi';
import { MedicalRecord } from '../types/medical';

interface MedicalRecordQueryParams extends BaseFilterParams {
  status?: string;
  doctorId?: number;
  tab?: string;
  sortBy?: string;
  sortDir?: string;
}

export const medicalApi = {
  getRecordsPaged: async (
    params?: MedicalRecordQueryParams
  ): Promise<{ content: MedicalRecord[]; totalElements: number }> => {
    try {
      const res = await axiosInstance.get('/medical-records', { params });
      return parsePagedResponse<MedicalRecord>(res.data);
    } catch (e) {
      console.error(e);
      return { content: [], totalElements: 0 };
    }
  },

  getActiveVisitsPaged: async (
    params?: Omit<MedicalRecordQueryParams, 'tab'>
  ): Promise<{ content: MedicalRecord[]; totalElements: number }> => {
    return medicalApi.getRecordsPaged({ ...params, tab: 'active' });
  },
};
