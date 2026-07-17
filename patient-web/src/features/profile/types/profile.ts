export interface PatientProfile {
  patientId: number;
  accountId: number;
  email: string;
  fullName: string;
  phone?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
  address?: string;
  avatarUrl?: string;
  height?: number | null;
  weight?: number | null;
  bloodPressure?: string | null;
  pulse?: number | null;
  bloodType?: string | null;
  allergies?: string | null;
  medicalHistory?: string | null;
}

export interface UpdateProfilePayload {
  fullName: string;
  phone?: string;
  email?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  avatarUrl?: string;
  height?: number | null;
  weight?: number | null;
  bloodPressure?: string | null;
  pulse?: number | null;
  bloodType?: string | null;
  allergies?: string | null;
  medicalHistory?: string | null;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  confirm_password: string;
}