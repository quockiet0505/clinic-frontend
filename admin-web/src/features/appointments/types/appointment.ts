export type AppointmentType = 'ONLINE' | 'WALK_IN';
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface Appointment {
  appointment_id: number;
  patient_id: number;
  patient_name: string;
  main_doctor_id: number;
  doctor_name: string;
  appointment_date: string;
  time_start: string;
  time_end?: string;
  appointment_type: AppointmentType;
  status: AppointmentStatus;
  created_by: 'PATIENT' | 'STAFF';
  cancel_reason?: string;
  cancelled_by?: 'PATIENT' | 'CLINIC';
}

export interface FollowUp {
  follow_up_id: number;
  record_id: number;
  patient_id: number;
  account_id?: number; 
  patient_name: string;
  phone: string;
  doctor_id: number;
  doctor_name: string;
  scheduled_datetime: string;
  note: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'MISSED';
}