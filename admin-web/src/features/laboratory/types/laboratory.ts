export type OrderStatus = 'ORDERED' | 'DONE' | 'CANCELLED' | 'REJECTED';

export interface ServiceOrder {
  order_id: number;
  record_id: number;
  service_id: number;
  service_name: string; // Joined from service
  patient_name: string; // Joined from patient
  ordered_by: number;
  doctor_name: string;  // Joined from staff
  status: OrderStatus;
  sample_collected_at?: string;
  created_at: string;
}

export interface ServiceResult {
  result_id: number;
  order_id: number;
  service_name: string; // Joined
  patient_name: string; // Joined
  doctor_name: string;  // Joined
  result_data: string;
  conclusion: string;
  attachment_url?: string;
  entered_by: number;
  entered_name: string; // Joined from staff
  entered_at: string;
}