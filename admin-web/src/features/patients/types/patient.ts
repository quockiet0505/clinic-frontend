export interface Patient {
     patientId: number;
     accountId?: number;
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
     height?: number;
     weight?: number;
     bloodPressure?: string;
     pulse?: number;
     medicalHistory?: string;
     isActive?: number;
     bookingLocked?: boolean;
     cancelSpamCount?: number;
   }