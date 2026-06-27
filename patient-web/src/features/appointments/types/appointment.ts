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
  imageUrl?: string;
}

export interface Service {
  serviceId: number;
  serviceName: string;
  price: number;
  description?: string;
  serviceType?: string;
  originalPrice?: number;
  discountPrice?: number;
}

export interface AvailableDate {
  dateString: string;
  displayDate: string;
  dayOfWeek: string;
}

// Backend returns only timeStart, timeEnd, isAvailable
export interface TimeSlotRaw {
  timeStart: string;
  timeEnd: string;
  isAvailable: boolean;
  doctorId?: number;
  doctorName?: string;
}

// Frontend computed fields
export interface TimeSlot extends TimeSlotRaw {
  displayTime: string;
  period: 'morning' | 'afternoon';
}

export type BookingMode = 'DOCTOR' | 'SERVICE';

export interface BookingFormState {
  bookingMode: BookingMode;
  expertiseId: number | '';
  serviceId: number | '';
  doctorId: number | '';
  appointmentDate: string;
  timeStart: string;
  timeEnd: string;
  description: string;
  suggestedExpertiseId?: number | '';
  isAiSuggested?: boolean;
}

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'IN_PROGRESS' | 'WAITING_RESULT' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'SKIPPED';

export interface AppointmentHistoryItem {
  id: string; // appointmentId
  appointmentDate: string;
  timeStart: string;
  timeEnd: string;
  status: AppointmentStatus;
  mainDoctorId?: number; // to map image
  doctorName: string;
  doctorImageUrl?: string; // mapped from getDoctors API
  specialty: string; // expertiseName
  expertiseId?: number;
  serviceId?: number;
  serviceName: string; // newly added to distinguish consultation/test
  serviceType?: 'EXAM' | 'LAB_TEST' | 'X_RAY' | 'ULTRASOUND' | 'CT_SCAN' | 'MRI' | 'ENDOSCOPY' | 'OTHER';
  servicePrice?: number;
  doctorFee?: number;
  facility: string;
  symptoms: string; // note
  queueNumber?: number;
  createdAt: string;
  bookingMode?: BookingMode;
  isAiSuggested?: boolean;
  suggestedExpertiseId?: number;
  rescheduleReason?: string;
  rescheduleCount?: number;
}