export interface PatientProfile {
  patient_id: number;
  account_id: number;
  email: string;
  full_name: string;
  phone?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  date_of_birth?: string;
  address?: string;
  avatar_url?: string;
}

export interface UpdateProfilePayload {
  full_name: string;
  phone?: string;
  email?: string;
  gender?: string;
  date_of_birth?: string;
  address?: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  confirm_password: string;
}