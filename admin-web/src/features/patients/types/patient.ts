export interface Patient {
     patient_id: number;
     full_name: string;
     gender: string;
     date_of_birth: string;
     phone: string;
     address: string;
     blood_type?: string;     // From patient_vital_profile
     allergies?: string;      // From patient_vital_profile
     emergency_contact?: string; // Joined or derived
   }