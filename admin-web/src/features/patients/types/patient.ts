export interface Patient {
     patientId: number;
     fullName: string;
     gender: string;
     dateOfBirth: string;
     age?: number;
     email?: string;
     phone: string;
     avatarUrl?:string;
     address: string;
     bloodType?: string;
     allergies?: string;
     chronicDiseases?: string;
     recentVisits?: any[];
     emergencyContact?: string;
   }