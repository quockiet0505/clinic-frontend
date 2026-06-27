export type OrderStatus = 'ORDERED' | 'DONE' | 'CANCELLED' | 'REJECTED';

export interface ServiceOrder {
  orderId: number;
  recordId: number;
  serviceId: number;
  serviceName: string; // Joined from service
  patientName: string; // Joined from patient
  orderedBy: number;
  doctorName: string;  // Joined from staff
  status: OrderStatus;
  appointmentDate?: string;
  timeStart?: string;
  timeEnd?: string;
  sample_collected_at?: string;
  createdAt: string;
}

export interface ServiceResult {
  resultId: number;
  orderId: number;
  serviceName: string; // Joined
  patientName: string; // Joined
  doctorName: string;  // Joined
  resultData: string;
  conclusion: string;
  attachmentUrl?: string;
  enteredById: number;
  enteredByName: string;
  enteredAt: string;
}