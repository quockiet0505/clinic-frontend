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
  serviceOriginalFee?: number;
  serviceDiscount?: number;
  serviceFinalFee?: number;
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
  consultationOriginalFee?: number;
  consultationDiscount?: number;
  consultationFinalFee?: number;
}

export interface MedicalRecordDetail extends MedicalRecord {
  patientFullName?: string;
  patientGender?: string;
  patientDob?: string;
  patientPhone?: string;
  patientAddress?: string;
  prescription?: Prescription;
  serviceOrders: ServiceOrder[];
  followUps: FollowUp[];
}