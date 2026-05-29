export interface Expertise {
  expertiseId: number;
  expertiseName: string;
  description?: string;
}

export interface Doctor {
  staffId: number;
  fullName: string;

  expertiseId?: number;
  expertiseName?: string;

  description?: string;
}

export interface Service {
  serviceId: number;
  serviceName: string;
  price: number;
  description?: string;
}

export interface AvailableDate {
  dateString: string;
  displayDate: string;
  dayOfWeek: string;
}

// Backend returns only timeStart, timeEnd, isAvailable
export interface TimeSlotRaw {
  timeStart: string;   // "08:00:00"
  timeEnd: string;     // "08:30:00"
  isAvailable: boolean;
}

// Frontend computed fields
export interface TimeSlot extends TimeSlotRaw {
  displayTime: string;       // "08:00 - 08:30"
  period: 'morning' | 'afternoon';
}

export interface BookingFormState {
  expertiseId: number | '';
  serviceId: number | '';
  doctorId: number | '';
  appointmentDate: string;
  timeStart: string;
  timeEnd: string;
  description: string;
}

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'IN_PROGRESS' | 'WAITING_RESULT' | 'COMPLETED' | 'CANCELLED';

export interface AppointmentHistoryItem {
  id: string;
  appointmentDate: string;
  timeStart: string;
  timeEnd: string;
  status: AppointmentStatus;
  doctorName: string;
  specialty: string;
  facility: string;
  symptoms: string;
  createdAt: string;
}