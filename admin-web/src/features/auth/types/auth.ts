export interface User {
  id: string;
  email: string;
  fullName: string;

  role: 'ADMIN' | 'DOCTOR' | 'STAFF' | 'LAB_TECH';

  roles: string[];

  avatar?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}