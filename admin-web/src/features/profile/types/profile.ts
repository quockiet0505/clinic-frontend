export interface UserProfile {
  staffId: number;
  accountId: number;
  fullName: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  date_of_birth: string;
  phone: string;
  email: string;
  address: string;
  roleName: string;
  createdAt: string;
}