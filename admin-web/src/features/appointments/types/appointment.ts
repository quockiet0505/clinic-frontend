export type AppointmentType = 'ONLINE' | 'WALK_IN';
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface Appointment {
  appointmentId: number;
  patientId: number;
  patientName: string;
  mainDoctorId: number;
  doctorName: string;
  appointmentDate: string;
  timeStart: string;
  timeEnd?: string;
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  createdBy: 'PATIENT' | 'STAFF';
  cancelReason?: string;
  cancelledBy?: 'PATIENT' | 'CLINIC';
}

export interface FollowUp {
  followUpId: number;
  recordId: number;
  patientId: number;
  accountId?: number; 
  patientName: string;
  phone: string;
  doctorId: number;
  doctorName: string;
  scheduledDatetime: string;
  note: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'MISSED';
}