export interface User {
  id: string;
  email: string;
  fullName: string;

  role: 'ADMIN' | 'DOCTOR' |  'LAB_TECH' | 'RECEPTIONIST' | 'NURSE';

  roles: string[];

  avatar?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}