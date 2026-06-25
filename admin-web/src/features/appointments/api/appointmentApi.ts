import axiosInstance from '@/config/axios';
import { Appointment } from '../types/appointment';

interface AppointmentQueryParams {
  search?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  tab?: string;          // 'today' | 'upcoming' | 'queue'
  source?: string;       // 'ONLINE' | 'WALK_IN'
  serviceType?: string;  // 'EXAM' | 'LAB_TEST' | 'IMAGING'
  doctorId?: number;
  patientId?: number;
  page?: number;         // 0‑based
  size?: number;
  sortBy?: string;
  sortDir?: 'ASC' | 'DESC';
}

export const appointmentApi = {
  // Lấy tất cả (không phân trang) – dùng cho Calendar
  getAll: async (): Promise<Appointment[]> => {
    try {
      const response = await axiosInstance.get('/appointments/all');
      const apiResponse = response.data;
      if (apiResponse.success && Array.isArray(apiResponse.data)) {
        return apiResponse.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching all appointments:', error);
      return [];
    }
  },

  // Lấy có phân trang – dùng cho AppointmentList
  getAllPaged: async (params?: AppointmentQueryParams): Promise<{ content: Appointment[]; totalElements: number }> => {
    try {
      const response = await axiosInstance.get('/appointments', { params });
      const apiResponse = response.data;
      if (apiResponse.success && apiResponse.data) {
        return {
          content: apiResponse.data.content || [],
          totalElements: apiResponse.data.totalElements || 0,
        };
      }
      console.warn('Unexpected API response structure:', apiResponse);
      return { content: [], totalElements: 0 };
    } catch (error) {
      console.error('Error fetching paged appointments:', error);
      return { content: [], totalElements: 0 };
    }
  },

  cancel: async (id: number, reason: string): Promise<void> => {
    await axiosInstance.patch(`/appointments/${id}/cancel`, null, {
      params: { reason },
      toastSuccess: 'Đã hủy lịch hẹn',
    });
  },

  checkIn: async (id: number, isPriority: boolean = false): Promise<void> => {
    await axiosInstance.patch(`/appointments/${id}/status`, null, {
      params: { status: 'CHECKED_IN', isPriority },
      toastSuccess: 'Đã check-in bệnh nhân',
    });
  },

  createWalkIn: async (data: any): Promise<void> => {
    await axiosInstance.post(
      '/appointments',
      { ...data, appointmentType: 'WALK_IN' },
      { toastSuccess: 'Đã tạo lịch hẹn walk-in' }
    );
  },

  transfer: async (id: number, newDoctorId: number): Promise<void> => {
    await axiosInstance.patch(`/appointments/${id}/transfer`, null, {
      params: { newDoctorId },
      toastSuccess: 'Đã chuyển bác sĩ',
    });
  },

  // ---- Queue Management (Doctor Workflow) ----
  callPatient: async (id: number): Promise<void> => {
    await axiosInstance.patch(`/appointments/${id}/queue/call`);
  },
  skipPatient: async (id: number): Promise<void> => {
    await axiosInstance.patch(`/appointments/${id}/queue/skip`);
  },
  returnToQueue: async (id: number): Promise<void> => {
    await axiosInstance.patch(`/appointments/${id}/queue/return`);
  },
  sendToLab: async (id: number): Promise<void> => {
    await axiosInstance.patch(`/appointments/${id}/queue/send-to-lab`);
  },
  returnFromLab: async (id: number): Promise<void> => {
    await axiosInstance.patch(`/appointments/${id}/queue/return-from-lab`);
  },
  complete: async (id: number): Promise<void> => {
    await axiosInstance.patch(`/appointments/${id}/status`, null, { params: { status: 'COMPLETED' } });
  },
};