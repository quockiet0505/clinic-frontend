// src/features/appointments/api/appointmentApi.ts
import type { AppointmentHistory, AvailableDate, Doctor, Expertise, Service, TimeSlot } from '../types/appointment';

// Thêm trường description vào các Interface (sếp có thể update trực tiếp trong types/appointment.ts)
// export interface Expertise { id: number; name: string; description?: string; }
// export interface Service { id: number; name: string; price: number; description?: string; }
// export interface Doctor { id: number; expertiseId: number; fullName: string; description?: string; }

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
};