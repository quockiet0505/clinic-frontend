export interface Patient {
     patientId: number;
     fullName: string;
     gender: string;
     date_of_birth: string;
     phone: string;
     address: string;
     bloodType?: string;     // From patient_vital_profile
     allergies?: string;      // From patient_vital_profile
     emergencyContact?: string; // Joined or derived
   }