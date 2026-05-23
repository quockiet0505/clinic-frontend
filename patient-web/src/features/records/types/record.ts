// src/features/records/types/record.ts

export interface PrescriptionItem {
     id: string;
     medicineName: string;
     dosage: string;
     quantity: string;
     instructions: string;
   }
   
   export interface LabResult {
     id: string;
     testName: string;
     resultValue: string;
     normalRange: string;
     status: 'NORMAL' | 'ABNORMAL';
   }
   
   export interface MedicalRecord {
     id: string;
     visitDate: string; // YYYY-MM-DD
     doctorName: string;
     specialty: string;
     facility: string;
     symptoms: string;
     diagnosis: string;
     notes?: string;
     prescriptions?: PrescriptionItem[];
     labResults?: LabResult[];
   }