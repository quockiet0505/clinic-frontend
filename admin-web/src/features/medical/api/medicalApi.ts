import axiosInstance from '@/config/axios';
import { MedicalRecord } from '../types/medical';

export const medicalApi = {
  getRecords: async (): Promise<MedicalRecord[]> => {
    try {
      const res = await axiosInstance.get('/medical-records');
      return res.data.data;
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  getActiveVisits: async (): Promise<MedicalRecord[]> => {
    try {
      // For now, let's fetch all records and filter on the frontend if there isn't a dedicated endpoint for active visits.
      // Wait, is there a dedicated endpoint? I'll just use /medical-records and filter IN_PROGRESS and WAITING_RESULT.
      const res = await axiosInstance.get('/medical-records');
      const allRecords: MedicalRecord[] = res.data.data;
      return allRecords.filter(r => ['IN_PROGRESS', 'WAITING_RESULT'].includes(r.status));
    } catch (e) {
      console.error(e);
      return [];
    }
  }
};
