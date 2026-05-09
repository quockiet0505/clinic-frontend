export interface UserProfile {
     staff_id: number;
     account_id: number;
     full_name: string;
     gender: 'MALE' | 'FEMALE' | 'OTHER';
     date_of_birth: string;
     phone: string;
     email: string;
     address: string;
     role_name: string; // Lấy từ bảng role
     created_at: string;
   }