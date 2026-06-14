export interface Patient {
     patientId: number;
     fullName: string;
     gender: string;
     dateOfBirth: string;
     age?: number;
     email?: string;
     phone: string;
     address: string;
     bloodType?: string;
     allergies?: string;
     chronicDiseases?: string;
     recentVisits?: any[];
     emergencyContact?: string;
   }