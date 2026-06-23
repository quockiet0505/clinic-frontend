export type MedicalRecordStatus = 'IN_PROGRESS' | 'WAITING_RESULT' | 'DONE' | 'CANCELLED';

export interface MedicalRecord {
  recordId: number;
  patientId: number;
  appointmentId?: number;
  patientName: string; // Joined from patient
  mainDoctorId: number;
  doctorName: string; // Joined from staff
  diagnosis: string;
  treatment: string;
  note: string;
  status: MedicalRecordStatus;
  createdAt: string;
  
  // Custom UI fields derived from appointment/vitals
  queueNumber?: number;
  checkinTime?: string;
  vitalsTaken?: boolean;

  consultationFee?: number;
  serviceFee?: number;
}

export interface MedicalRecordDetail extends MedicalRecord {
  patientFullName?: string;
  patientGender?: string;
  patientDob?: string;
  patientPhone?: string;
  patientAddress?: string;
  prescription?: any;
  serviceOrders?: any[];
  followUps?: any[];
}

export interface VitalSigns {
  recordId: number;
  weight: number;
  bloodPressure: string;
  pulse: number;
}

export interface PrescriptionItem {
  id?: number; // UI only
  medicineId: number;
  medicationName: string;
  dosage: string;
  quantity: number;
}