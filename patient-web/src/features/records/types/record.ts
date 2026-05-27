export interface PrescriptionItem {
  medicineId?: number;
  medicineName: string;
  unit: string;
  quantity: number;
  dosage: string;
  price?: number;
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
  status: string;
  orderedBy: string;
  createdAt: string;
  result?: ServiceResult;
}

export interface FollowUp {
  followUpId: number;
  doctorName: string;
  scheduledDatetime: string;
  note: string;
  status: string;
}

export interface MedicalRecord {
  recordId: number;
  patientId: number;
  appointmentId?: number;
  mainDoctorId: number;
  mainDoctorName: string;
  diagnosis: string;
  treatment: string;
  note?: string;
  status: 'IN_PROGRESS' | 'WAITING_RESULT' | 'DONE' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecordDetail extends MedicalRecord {
  prescription?: Prescription;
  serviceOrders: ServiceOrder[];
  followUps: FollowUp[];
}