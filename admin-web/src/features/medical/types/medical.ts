export interface PrescriptionItem {
  id?: number;
  medicineId?: number | null;
  medicineName: string;
  unit: string;
  quantity: number;
  dosage: string;
  price?: number;
  warnings?: any[];
}

export interface Prescription {
  prescriptionId: number;
  recordId: number;
  items: PrescriptionItem[];
  createdAt: string;
}

export interface ServiceResult {
  resultId: number;
  resultData: string;
  conclusion: string;
  attachmentUrl?: string;
  enteredBy: string;
  enteredAt: string;
}

export interface ServiceOrder {
  orderId: number;
  serviceId: number;
  serviceName: string;
  price?: number;
  status: string;
  orderedBy: string;
  createdAt: string;
  result?: ServiceResult;
}

export interface FollowUp {
  followUpId: number;
  recordId?: number;
  patientId?: number;
  doctorId?: number;
  doctorName: string;
  appointmentId?: number | null;
  scheduledDatetime: string;
  note: string;
  status: string;
  confirmedAt?: string | null;
  reminderSentAt?: string | null;
  cancelReason?: string | null;
}

export interface MedicalRecord {
  recordId: number;
  patientId: number;
  appointmentId?: number;
  appointmentStatus?: string;
  queueNumber?: number;
  mainDoctorId: number;
  mainDoctorName: string;
  updatedByDoctorId?: number;
  updatedByDoctorName?: string;
  editReason?: string;
  vitalsTaken?: boolean;
  diagnosis: string;
  treatment: string;
  note?: string;
  status: 'IN_PROGRESS' | 'WAITING_RESULT' | 'DONE' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  consultationFinalFee?: number;
  serviceFinalFee?: number;
  patientName?: string;
  doctorName?: string;
  checkinTime?: string;
}

export interface VitalSigns {
  temperature?: number;
  bloodPressure?: string;
  pulse?: number;
  weight?: number;
  height?: number;
  bloodType?: string;
  allergies?: string;
  chronicDiseases?: string;
}

export interface MedicalRecordDetail extends MedicalRecord {
  patientFullName?: string;
  patientGender?: string;
  patientDob?: string;
  patientPhone?: string;
  patientAddress?: string;
  prescription?: any;
  serviceOrders?: ServiceOrder[];
  followUps?: any[];
  vitalsTaken?: boolean;
}