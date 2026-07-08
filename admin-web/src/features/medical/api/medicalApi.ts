import axiosInstance from '@/config/axios';
import { BaseFilterParams } from '@/types/common';
import { parsePagedResponse } from '@/utils/pagedApi';
import { MedicalRecord, MedicalRecordDetail } from '../types/medical';

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

  getRecordDetail: async (id: number): Promise<MedicalRecordDetail | null> => {
    try {
      const res = await axiosInstance.get(`/medical-records/${id}`);
      return res.data.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  updateTriage: async (id: number, data: unknown): Promise<void> => {
    await axiosInstance.post(`/medical-records/${id}/triage`, data, {
      toastSuccess: 'Đã lưu sinh hiệu thành công',
    });
  },

    updateRecord: async (
    id: number,
    data: {
      patientId: number;
      mainDoctorId: number;
      appointmentId?: number;
      diagnosis?: string;
      treatment?: string;
      note?: string;
      status?: string;
    }
  ): Promise<MedicalRecord | null> => {
    try {
      const res = await axiosInstance.put(`/medical-records/${id}`, data, {
        toastSuccess: 'Đã lưu hồ sơ khám',
      });
      return res.data.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  createPrescription: async (data: {
    recordId: number;
    notes?: string;
    items: {
      medicineId?: number | null;
      medicineName: string;
      unit: string;
      quantity: number;
      dosage: string;
    }[];
  }): Promise<void> => {
    await axiosInstance.post('/prescriptions', data, {
      toastSuccess: 'Đã lưu đơn thuốc thành công',
    });
  },

  checkInteractions: async (medicineIds: number[]): Promise<any[]> => {
    const res = await axiosInstance.post('/prescriptions/check-interactions', medicineIds);
    return res.data.data;
  },
};
