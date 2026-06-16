export interface Medicine {
  medicineId: number;
  name: string;
  activeElement: string;
  unit: string;
  usageNote?: string;
  productionUnit?: string;
  packingStandard?: string;
}

export interface PrescriptionUI {
  prescriptionId: number;
  recordId: number;
  patientName: string;
  doctorName: string;
  createdAt: string;
  status: 'PENDING' | 'DISPENSED';
  diagnosis?: string;
  consultationFee?: number;
  serviceFee?: number;
  items: {
    name: string;
    medicineName?: string;
    dosage: string;
    quantity: number;
    unit?: string;
  }[];
}