import axiosInstance from '@/config/axios';
import type { ApiResponse } from '@/config/api';

export interface PatientFollowUp {
  followUpId: number;
  recordId: number;
  patientId: number;
  doctorId: number;
  doctorName: string;
  appointmentId?: number | null;
  scheduledDatetime: string;
  note?: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'MISSED';
  confirmedAt?: string | null;
}

export const followUpApi = {
  getMyFollowUps: async (): Promise<PatientFollowUp[]> => {
    const res = await axiosInstance.get<ApiResponse<PatientFollowUp[]>>('/follow-ups/my', {
      skipToast: true,
    });
    return res.data.data ?? [];
  },

  confirm: async (followUpId: number): Promise<PatientFollowUp> => {
    const res = await axiosInstance.post<ApiResponse<PatientFollowUp>>(
      `/follow-ups/${followUpId}/confirm`,
      undefined,
      { toastSuccess: 'Đã xác nhận lịch tái khám' }
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Không thể xác nhận tái khám');
    }
    return res.data.data;
  },

  decline: async (followUpId: number, reason?: string): Promise<PatientFollowUp> => {
    const res = await axiosInstance.post<ApiResponse<PatientFollowUp>>(
      `/follow-ups/${followUpId}/decline`,
      null,
      {
        params: reason ? { reason } : undefined,
        toastSuccess: 'Đã ghi nhận từ chối tái khám',
      }
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || 'Không thể từ chối tái khám');
    }
    return res.data.data;
  },
};
