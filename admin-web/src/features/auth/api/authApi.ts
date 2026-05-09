import { LoginResponse } from '../types/auth';

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    // Simulate network delay for API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@clinic.com' && password === '123456') {
          resolve({
            user: { 
              id: 'USR-01', 
              email: 'admin@clinic.com', 
              fullName: 'System Admin', 
              role: 'ADMIN' 
            },
            token: 'mock-jwt-token-12345'
          });
        } else {
          reject(new Error('Invalid email or password.'));
        }
      }, 1000);
    });
  }
};