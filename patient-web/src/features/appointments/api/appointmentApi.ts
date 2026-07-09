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
function enrichTimeSlot(slot: any): TimeSlot {
  const displayTime = `${slot.timeStart.substring(0, 5)} - ${slot.timeEnd.substring(0, 5)}`;
  const hour = parseInt(slot.timeStart.split(':')[0], 10);
  const period = hour < 12 ? 'morning' : 'afternoon';
  const isAvailable = slot.isAvailable ?? slot.available ?? false;
  return { ...slot, displayTime, period, isAvailable };
}

export const appointmentApi = {
  // Public endpoints
  getExpertises: async (): Promise<Expertise[]> => {
    const res = await axiosInstance.get<ApiResponse<Expertise[]>>('/expertise/all');
    // Hide technician specialties (42: Xét nghiệm, 43: CĐHA, 44: Siêu âm, 45: Nội soi) from patients
    const technicianIds = [42, 43, 44, 45];
    return res.data.data.filter(exp => !technicianIds.includes(exp.expertiseId));
  },

  getServices: async (): Promise<Service[]> => {
    const res = await axiosInstance.get<ApiResponse<Service[]>>('/services/all', {
      params: { bookableOnly: true },
    });
    return res.data.data;
  },

  getDoctorsByExpertise: async (expertiseId: number): Promise<Doctor[]> => {
    const res = await axiosInstance.get<ApiResponse<Doctor[]>>(`/staffs/filter?expertiseId=${expertiseId}&staffType=DOCTOR`);
    return res.data.data;
  },

  getAvailableDates: async (): Promise<AvailableDate[]> => {
    const dates: AvailableDate[] = [];
    const today = new Date();
    let daysAdded = 0;
    let offset = 1;

    while (daysAdded < 7 && offset <= 14) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + offset);
      offset++;

      if (nextDate.getDay() === 0) continue; // Skip Sunday

      const yyyy = nextDate.getFullYear();
      const mm = String(nextDate.getMonth() + 1).padStart(2, '0');
      const dd = String(nextDate.getDate()).padStart(2, '0');
      const weekdays = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
      dates.push({
        dateString: `${yyyy}-${mm}-${dd}`,
        displayDate: `${dd}/${mm}`,
        dayOfWeek: weekdays[nextDate.getDay()],
      });
      daysAdded++;
    }
    return dates;
  },

  getTimeSlots: async (
    appointmentDate: string,
    options: { doctorId?: number; expertiseId?: number; serviceId?: number }
  ): Promise<TimeSlot[]> => {
    const params = new URLSearchParams({ date: appointmentDate });
    if (options.doctorId) params.set('doctorId', String(options.doctorId));
    if (options.expertiseId) params.set('expertiseId', String(options.expertiseId));
    if (options.serviceId) params.set('serviceId', String(options.serviceId));
    const res = await axiosInstance.get<ApiResponse<TimeSlotRaw[]>>(
      `/appointments/slots?${params.toString()}`
    );
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
      mainDoctorId: data.doctorId || null,
      expertiseId: data.expertiseId || null,
      suggestedExpertiseId: data.suggestedExpertiseId || null,
      serviceId: data.serviceId || null,
      bookingMode: data.bookingMode,
      isAiSuggested: data.isAiSuggested ?? false,
      appointmentType: 'ONLINE',
      createdBy: 'PATIENT',
      note: data.description,
    };
  
    const res =
      await axiosInstance.post('/appointments', payload, {
        toastSuccess: 'Lịch khám đã được đặt thành công',
      });

    if (!res.data.success) {
      throw new Error(res.data.message || 'Không thể tạo lịch hẹn');
    }

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
      doctorImageUrl: item.doctorImageUrl?.startsWith('/') ? `${import.meta.env.VITE_STATIC_BASE_URL || 'http://localhost:8080'}${item.doctorImageUrl}` : item.doctorImageUrl,
      specialty: item.expertiseName || item.specialty || 'Chưa xác định',
      expertiseId: item.expertiseId,
      serviceId: item.serviceId,
      serviceName: item.serviceName || 'Khám chuyên khoa',
      serviceType: item.serviceType,
      facility: 'Phòng khám Đa khoa',
      symptoms: item.note || item.symptoms || 'Không có triệu chứng',
      queueNumber: item.queueNumber,
      createdAt: item.createdAt || item.appointmentDate,
      bookingMode: item.bookingMode,
      isAiSuggested: item.isAiSuggested,
      suggestedExpertiseId: item.suggestedExpertiseId,
      rescheduleCount: item.rescheduleCount,
      rescheduleReason: item.rescheduleReason,
    }));
  },

  update: async (
    id: string | number,
    data: {
      appointmentDate: string;
      timeStart: string;
      timeEnd: string;
      mainDoctorId?: number;
      rescheduleReason: string;
    }
  ) => {
    const res = await axiosInstance.put(`/appointments/${id}`, data);
    return res.data.data;
  },

  cancelAppointment: async (id: string, reason: string): Promise<{ success: boolean; message: string }> => {
    const res = await axiosInstance.patch<ApiResponse<unknown>>(
      `/appointments/${id}/cancel?reason=${encodeURIComponent(reason)}`,
      undefined,
      { toastSuccess: 'Đã hủy lịch hẹn thành công' }
    );
    if (!res.data.success) {
      throw new Error(res.data.message || 'Không thể hủy lịch hẹn');
    }
    return { success: res.data.success, message: res.data.message };
  },

  getDoctorById: async (
    doctorId: number
  ): Promise<Doctor> => {
    const res = await axiosInstance.get<ApiResponse<Doctor>>(`/staffs/${doctorId}`);
    const doc = res.data.data;
    if (doc.imageUrl && doc.imageUrl.startsWith('/')) {
      doc.imageUrl = `${import.meta.env.VITE_STATIC_BASE_URL || 'http://localhost:8080'}${doc.imageUrl}`;
    }
    return doc;
  },

  getDoctors: async (): Promise<Doctor[]> => {
    const res = await axiosInstance.get<ApiResponse<Doctor[]>>(
      '/staffs/doctors'
    );
  
    return res.data.data;
  },
};