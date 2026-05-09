export type MedicalRecordStatus = 'IN_PROGRESS' | 'WAITING_RESULT' | 'DONE' | 'CANCELLED';

export interface MedicalRecord {
  record_id: number;
  patient_id: number;
  appointment_id?: number;
  patient_name: string; // Joined from patient
  main_doctor_id: number;
  doctor_name: string; // Joined from staff
  diagnosis: string;
  treatment: string;
  note: string;
  status: MedicalRecordStatus;
  created_at: string;
  
  // Custom UI fields derived from appointment/vitals
  queue_number?: number;
  checkin_time?: string;
  vitals_taken?: boolean;
}

export interface VitalSigns {
  record_id: number;
  weight: number;
  blood_pressure: string;
  pulse: number;
}

export interface PrescriptionItem {
  id?: number; // UI only
  medicine_id: number;
  medication_name: string;
  dosage: string;
  quantity: number;
}