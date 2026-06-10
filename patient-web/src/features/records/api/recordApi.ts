import axiosInstance from '@/config/axios';
import type { FollowUp, MedicalRecord, MedicalRecordDetail, Prescription, ServiceOrder } from '../types/record';

interface ApiMedicalRecordResponse {
  recordId: number;
  patientId: number;
  appointmentId: number | null;
  mainDoctorId: number;
  mainDoctorName: string;
  diagnosis: string;
  treatment: string;
  note: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiPrescriptionItem {
  medicineName: string;
  unit: string;
  quantity: number;
  dosage: string;
  price?: number;
}

interface ApiPrescription {
  prescriptionId: number;
  recordId: number;
  items: ApiPrescriptionItem[];
  createdAt: string;
}

interface ApiServiceResult {
  resultId: number;
  resultData: string;
  conclusion: string;
  attachmentUrl?: string;
  enteredBy: string;
  enteredAt: string;
}

interface ApiServiceOrder {
  orderId: number;
  serviceId: number;
  serviceName: string;
  status: string;
  orderedBy: string;
  createdAt: string;
  result?: ApiServiceResult;
}

interface ApiFollowUp {
  followUpId: number;
  doctorName: string;
  scheduledDatetime: string;
  note: string;
  status: string;
}

interface ApiMedicalRecordDetailResponse extends ApiMedicalRecordResponse {
  prescription?: ApiPrescription;
  serviceOrders: ApiServiceOrder[];
  followUps: ApiFollowUp[];
}

function transformMedicalRecord(item: ApiMedicalRecordResponse): MedicalRecord {
  return {
    recordId: item.recordId,
    patientId: item.patientId,
    appointmentId: item.appointmentId ?? undefined,
    mainDoctorId: item.mainDoctorId,
    mainDoctorName: item.mainDoctorName,
    diagnosis: item.diagnosis,
    treatment: item.treatment,
    note: item.note ?? undefined,
    status: item.status as MedicalRecord['status'],
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function transformPrescription(pres: ApiPrescription): Prescription {
  return {
    prescriptionId: pres.prescriptionId,
    recordId: pres.recordId,
    items: pres.items.map(item => ({
      medicineName: item.medicineName,
      unit: item.unit,
      quantity: item.quantity,
      dosage: item.dosage,
      price: item.price,
    })),
    createdAt: pres.createdAt,
  };
}

function transformServiceOrder(order: ApiServiceOrder): ServiceOrder {
  return {
    orderId: order.orderId,
    serviceId: order.serviceId,
    serviceName: order.serviceName,
    status: order.status,
    orderedBy: order.orderedBy,
    createdAt: order.createdAt,
    result: order.result ? {
      resultId: order.result.resultId,
      resultData: order.result.resultData,
      conclusion: order.result.conclusion,
      attachmentUrl: order.result.attachmentUrl,
      enteredBy: order.result.enteredBy,
      enteredAt: order.result.enteredAt,
    } : undefined,
  };
}

function transformFollowUp(follow: ApiFollowUp): FollowUp {
  return {
    followUpId: follow.followUpId,
    doctorName: follow.doctorName,
    scheduledDatetime: follow.scheduledDatetime,
    note: follow.note,
    status: follow.status,
  };
}

export const recordApi = {
  getMedicalHistory: async (): Promise<MedicalRecord[]> => {
    const response = await axiosInstance.get<ApiMedicalRecordResponse[]>('/medical-records/my');
    return response.data.map(transformMedicalRecord);
  },

  getRecordDetail: async (recordId: number): Promise<MedicalRecordDetail> => {
    const response = await axiosInstance.get<{data: ApiMedicalRecordDetailResponse}>(`/medical-records/${recordId}`);
    const data = response.data.data;
    return {
      ...transformMedicalRecord(data),
      prescription: data.prescription ? transformPrescription(data.prescription) : undefined,
      serviceOrders: data.serviceOrders.map(transformServiceOrder),
      followUps: data.followUps.map(transformFollowUp),
    };
  },

  getPrescriptions: async (): Promise<Prescription[]> => {
    const response = await axiosInstance.get<{data: ApiPrescription[]}>('/prescriptions/my');
    return response.data.data.map(transformPrescription);
  },

  getLabResults: async (): Promise<any[]> => {
    const response = await axiosInstance.get<{data: any[]}>('/service-results/my');
    return response.data.data;
  },
};