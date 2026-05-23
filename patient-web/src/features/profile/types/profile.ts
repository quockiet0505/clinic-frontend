// src/features/profile/types/profile.ts

// Maps to the 'patient' and 'account' tables
export interface PatientProfile {
     id: number;
     accountId: number;
     email: string; // From account
     fullName: string;
     phone: string;
     gender: 'MALE' | 'FEMALE' | 'OTHER' | '';
     dateOfBirth: string; // Format: YYYY-MM-DD
     address: string;
     avatarUrl?: string;
   }
   
   export interface UpdateProfilePayload {
     fullName: string;
     phone: string;
     gender: string;
     dateOfBirth: string;
     address: string;
   }