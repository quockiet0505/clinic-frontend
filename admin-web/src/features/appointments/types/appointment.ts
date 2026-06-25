export type AppointmentType = 'ONLINE' | 'WALK_IN';
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export type BookingMode = 'DOCTOR' | 'EXPERTISE' | 'SERVICE' | 'DIRECT';

export interface Appointment {
  appointmentId: number;
  patientId: number;
  patientName: string;
  mainDoctorId?: number;
  doctorName?: string;
  serviceId?: number;
  serviceName?: string;
  expertiseId?: number;
  expertiseName?: string;
  suggestedExpertiseId?: number;
  suggestedExpertiseName?: string;
  bookingMode?: BookingMode;
  isAiSuggested?: boolean;
  appointmentDate: string;
  timeStart: string;
  timeEnd?: string;
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  createdBy: 'PATIENT' | 'STAFF';
  cancelReason?: string;
  cancelledBy?: 'PATIENT' | 'CLINIC';
  note?: string;
  isDoctorBusy?: boolean;
  queueNumber?: number;
}

export interface FollowUp {
  followUpId: number;
  recordId: number;
  patientId: number;
  accountId?: number; 
  patientName: string;
  phone?: string;
  doctorId: number;
  doctorName: string;
  appointmentId?: number | null;
  scheduledDatetime: string;
  note: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'MISSED';
  confirmedAt?: string | null;
  reminderSentAt?: string | null;
  cancelReason?: string | null;
}

export interface FollowUpCreateRequest {
  recordId: number;
  patientId: number;
  doctorId: number;
  scheduledDatetime: string;
  note?: string;
}

const BOOKING_MODE_LABEL: Record<BookingMode, string> = {
  DOCTOR: 'Theo bác sĩ',
  EXPERTISE: 'Theo chuyên khoa',
  SERVICE: 'Dịch vụ',
  DIRECT: 'Trực tiếp',
};

export function getBookingModeLabel(mode?: BookingMode): string {
  if (!mode) return '—';
  return BOOKING_MODE_LABEL[mode] ?? mode;
}
