import type { User, AuthResponse } from '../types/auth';

// Utility to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authApi = {
  // Mock Patient Login
  login: async (email: string, password: string): Promise<AuthResponse> => {
    await delay(1500); 
    
    // Simulate finding a patient record
    if (email === 'benhnhan@gmail.com' && password === '123456') {
      const mockPatient: User = { 
        id: 1, 
        accountId: 101, 
        email: 'benhnhan@gmail.com', 
        fullName: 'Nguyễn Văn Bệnh Nhân', 
        phone: '0901234567',
        role: 'PATIENT' 
      };
      const mockToken = 'mock_jwt_token_patient_123';
      
      // Persist auth state for the Header component
      localStorage.setItem('user', JSON.stringify(mockPatient));
      localStorage.setItem('token', mockToken);

      return { user: mockPatient, token: mockToken };
    }
    
    throw new Error('Email hoặc mật khẩu không chính xác!');
  },

  // Mock Patient Registration
  register: async (fullName: string, email: string, password: string, phone?: string): Promise<AuthResponse> => {
    await delay(1500);
    
    // Simulate creating account and patient records
    const newPatient: User = { 
      id: 2, 
      accountId: 102, 
      email, 
      fullName, // Mandatory based on schema4.sql
      phone,    // Optional based on schema4.sql
      role: 'PATIENT' 
    };
    const mockToken = 'mock_jwt_token_new_patient';
    
    // Auto-login upon successful registration
    localStorage.setItem('user', JSON.stringify(newPatient));
    localStorage.setItem('token', mockToken);

    return { user: newPatient, token: mockToken };
  }
};