// Define User structure aligned with 'account' and 'patient' database tables
export interface User {
     id: number;
     accountId: number;
     email: string;
     fullName: string; // REQUIRED field in 'patient' table
     phone?: string;   // OPTIONAL field in 'patient' table
     role: 'PATIENT';  // Explicitly restrict to Patient role
   }
   
   export interface AuthResponse {
     user: User;
     token: string;
   }