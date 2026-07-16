export interface User {
  accountId: number;
  email: string;
  roles: string[];
  fullName?: string;
  phone?: string;
  address?: string;
  gender?: string;
  dateOfBirth?: string;
  patientId?: number;
}

export interface AuthResponse {
  accountId: number;
  email: string;
  token: string;
  roles: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  address: string;
}