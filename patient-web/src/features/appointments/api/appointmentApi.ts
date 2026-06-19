/* eslint-disable @typescript-eslint/no-unused-vars */
import axiosInstance from '@/config/axios';
import type { ApiResponse } from '@/config/api';
import type {
  AppointmentHistoryItem,
  AvailableDate,
  BookingFormState,
  Doctor,
  Expertise,
  Service,
  TimeSlotRaw,
  TimeSlot,
} from '../types/appointment';

// Helper to compute displayTime and period from timeStart/timeEnd
function enrichTimeSlot(slot: TimeSlotRaw): TimeSlot {
  const displayTime = `${slot.timeStart.substring(0, 5)} - ${slot.timeEnd.substring(0, 5)}`;
  const hour = parseInt(slot.timeStart.split(':')[0], 10);
  const period = hour < 12 ? 'morning' : 'afternoon';
  return { ...slot, displayTime, period };
}

export const appointmentApi = {
  // Public endpoints
  getExpertises: async (): Promise<Expertise[]> => {
    const res = await axiosInstance.get<ApiResponse<Expertise[]>>('/expertise/all');
    return res.data.data;
  },

  getServices: async (): Promise<Service[]> => {
    const res = await axiosInstance.get<ApiResponse<Service[]>>('/services/all');
    return res.data.data;
  },

  getDoctorsByExpertise: async (expertiseId: number): Promise<Doctor[]> => {
    const res = await axiosInstance.get<ApiResponse<Doctor[]>>(`/staffs/filter?expertiseId=${expertiseId}&staffType=DOCTOR`);
    return res.data.data;
  },

  getAvailableDates: async (): Promise<AvailableDate[]> => {
    const dates: AvailableDate[] = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      const yyyy = nextDate.getFullYear();
      const mm = String(nextDate.getMonth() + 1).padStart(2, '0');
      const dd = String(nextDate.getDate()).padStart(2, '0');
      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      dates.push({
        dateString: `${yyyy}-${mm}-${dd}`,
        displayDate: `${dd}/${mm}`,
        dayOfWeek: weekdays[nextDate.getDay()],
      });
    }
    return dates;
  },

  getTimeSlots: async (appointmentDate: string, doctorId: number): Promise<TimeSlot[]> => {
    const res = await axiosInstance.get<ApiResponse<TimeSlotRaw[]>>(`/appointments/slots?doctorId=${doctorId}&date=${appointmentDate}`);
    return res.data.data.map(enrichTimeSlot);
  },

  // Authenticated endpoints
  createAppointment: async (
    data: BookingFormState
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
  
    const payload = {
      appointmentDate: data.appointmentDate,
      timeStart: data.timeStart,
      timeEnd: data.timeEnd,
  
      mainDoctorId:
        data.doctorId || null,
  
      expertiseId:
        data.expertiseId || null,
  
      serviceId:
        data.serviceId || null,
  
      appointmentType: 'ONLINE',
  
      createdBy: 'PATIENT',
  
      note: data.description,
    };
  
    const res =
      await axiosInstance.post(
        '/appointments',
        payload
      );
  
    return {
      success: res.data.success,
      message: res.data.message,
    };
  },

  getMyAppointments: async (): Promise<AppointmentHistoryItem[]> => {
    const res = await axiosInstance.get<ApiResponse<any[]>>('/appointments/my');
    return res.data.data.map(item => ({
      id: item.appointmentId?.toString() || item.id,
      appointmentDate: item.appointmentDate,
      timeStart: item.timeStart,
      timeEnd: item.timeEnd,
      status: item.status,
      mainDoctorId: item.mainDoctorId,
      doctorName: item.doctorName || 'Chưa xếp bác sĩ',
      specialty: item.expertiseName || item.specialty || 'Chưa xác định',
      serviceName: item.serviceName || 'Khám chuyên khoa',
      facility: 'Phòng khám Đa khoa',
      symptoms: item.note || item.symptoms || 'Không có triệu chứng',
      queueNumber: item.queueNumber,
      createdAt: item.createdAt || item.appointmentDate,
    }));
  },

  cancelAppointment: async (id: string, reason: string): Promise<{ success: boolean; message: string }> => {
    const res = await axiosInstance.patch<ApiResponse<unknown>>(`/appointments/${id}/cancel?reason=${encodeURIComponent(reason)}`);
    return { success: res.data.success, message: res.data.message };
  },

  getDoctorById: async (
    doctorId: number
  ): Promise<Doctor> => {
    const res =
      await axiosInstance.get<
        ApiResponse<Doctor>
      >(`/staffs/${doctorId}`);
  
    return res.data.data;
  },

  getDoctors: async (): Promise<Doctor[]> => {
    const res = await axiosInstance.get<ApiResponse<Doctor[]>>(
      '/staffs/doctors'
    );
  
    return res.data.data;
  },
};