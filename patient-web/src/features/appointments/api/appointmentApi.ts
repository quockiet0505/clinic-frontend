// src/features/appointments/api/appointmentApi.ts
import type { AppointmentHistory, AppointmentHistoryItem, AvailableDate, Doctor, Expertise, Service, TimeSlot } from '../types/appointment';

// Thêm trường description vào các Interface (sếp có thể update trực tiếp trong types/appointment.ts)
// export interface Expertise { id: number; name: string; description?: string; }
// export interface Service { id: number; name: string; price: number; description?: string; }
// export interface Doctor { id: number; expertiseId: number; fullName: string; description?: string; }
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const appointmentApi = {
  getExpertises(): Promise<any[]> {
    return Promise.resolve([
      { id: 1, name: 'Nội Tim mạch - Tổng quát', description: 'Triệu chứng: Đau thắt ngực / Tim đập nhanh kèm khó thở / Mạch không đều / Rối loạn mỡ máu...' },
      { id: 2, name: 'Nội thần kinh', description: 'Triệu chứng: Ngồi lâu đứng dậy bị choáng / Mất ngủ thường xuyên / Đau đầu không rõ nguyên nhân...' },
      { id: 3, name: 'Cơ Xương Khớp', description: 'Triệu chứng: Đau các khớp tay - chân / Đau lưng / Bong gân / Chấn thương thể thao...' },
    ]);
  },

  getServices(): Promise<any[]> {
    return Promise.resolve([
      { id: 1, name: 'Khám dịch vụ thường', price: 200000, description: 'Khám chuyên khoa tiêu chuẩn với bác sĩ điều trị.' },
      { id: 2, name: 'Khám chuyên gia VIP', price: 500000, description: 'Được ưu tiên khám trước, khám trực tiếp với Trưởng/Phó khoa.' },
    ]);
  },

  getDoctorsByExpertise(expertiseId: number): Promise<any[]> {
    return Promise.resolve([
      { id: 1, expertiseId, fullName: 'BS CKII. Ngô Trung Nam', description: 'Hơn 20 năm kinh nghiệm. Trưởng khoa Nội.' },
      { id: 2, expertiseId, fullName: 'BS. Trần Thị Mây', description: 'Chuyên gia tư vấn và điều trị các bệnh lý phức tạp.' },
    ]);
  },

  getAvailableDates(): Promise<AvailableDate[]> {
    const dates: AvailableDate[] = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      const yyyy = nextDate.getFullYear();
      const mm = String(nextDate.getMonth() + 1).padStart(2, '0');
      const dd = String(nextDate.getDate()).padStart(2, '0');
      const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
      dates.push({
        dateString: `${yyyy}-${mm}-${dd}`,
        displayDate: `${dd}/${mm}`,
        dayOfWeek: days[nextDate.getDay()],
      });
    }
    return Promise.resolve(dates);
  },

  getTimeSlots(appointmentDate: string, p0: number): Promise<TimeSlot[]> {
    return Promise.resolve([
      { timeStart: '08:00:00', timeEnd: '08:30:00', displayTime: '08:00 - 08:30', period: 'morning', isAvailable: true },
      { timeStart: '08:30:00', timeEnd: '09:00:00', displayTime: '08:30 - 09:00', period: 'morning', isAvailable: true },
      { timeStart: '09:00:00', timeEnd: '09:30:00', displayTime: '09:00 - 09:30', period: 'morning', isAvailable: false },
      { timeStart: '13:30:00', timeEnd: '14:00:00', displayTime: '13:30 - 14:00', period: 'afternoon', isAvailable: true },
    ]);
  },

  getMyAppointments: async (): Promise<AppointmentHistoryItem[]> => {
    await delay(800); // Simulate network latency

    return [
      {
        id: 'APT-2026-0522',
        appointmentDate: '2026-05-25',
        timeStart: '08:00',
        timeEnd: '08:30',
        status: 'CONFIRMED',
        doctorName: 'BS. Trần Thị Mây',
        specialty: 'Nội Tổng Quát',
        facility: 'Phòng khám Đa khoa ClinicPro',
        symptoms: 'Khám sức khỏe định kỳ',
        createdAt: '2026-05-20T10:30:00Z'
      },
      {
        id: 'APT-2026-0510',
        appointmentDate: '2026-05-10',
        timeStart: '14:00',
        timeEnd: '14:30',
        status: 'COMPLETED',
        doctorName: 'BS CKII. Ngô Trung Nam',
        specialty: 'Nội Tim Mạch',
        facility: 'Phòng khám Đa khoa ClinicPro',
        symptoms: 'Tức ngực, khó thở',
        createdAt: '2026-05-05T09:15:00Z'
      },
      {
        id: 'APT-2026-0401',
        appointmentDate: '2026-04-05',
        timeStart: '09:30',
        timeEnd: '10:00',
        status: 'CANCELLED',
        doctorName: 'Hệ thống sắp xếp',
        specialty: 'Cơ Xương Khớp',
        facility: 'Phòng khám Đa khoa ClinicPro',
        symptoms: 'Đau lưng cấp',
        createdAt: '2026-04-01T14:20:00Z'
      }
    ];
  },

  // Cancel an appointment
  cancelAppointment: async (id: string): Promise<{ success: boolean; message: string }> => {
    await delay(1000);
    return { success: true, message: 'Hủy lịch khám thành công!' };
  }
};