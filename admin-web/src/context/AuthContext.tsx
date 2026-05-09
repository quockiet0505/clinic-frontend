import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// We will comment this out temporarily while building the UI without the backend
// import axiosClient from '@/config/axios'; 

export interface User {
  accountId: number;
  email: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // ====================================================================
    // 1. MOCK LOGIN (USE THIS FOR UI DEVELOPMENT WITHOUT BACKEND)
    // ====================================================================
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Using the email from your LoginForm placeholder
        if (email === 'admin@clinic.com' && password === '123456') {
          const loggedInUser: User = { accountId: 1, email, roles: ['ADMIN'] };
          const newToken = 'mock-jwt-token-12345';

          setToken(newToken);
          setUser(loggedInUser);

          localStorage.setItem('token', newToken);
          localStorage.setItem('user', JSON.stringify(loggedInUser));
          resolve();
        } else {
          // Triggers the red error box in LoginForm
          reject(new Error('Authentication failed. Use admin@clinic.com / 123456'));
        }
      }, 800);
    });

    // ====================================================================
    // 2. REAL API INTEGRATION (UNCOMMENT THIS WHEN BACKEND IS RUNNING)
    // ====================================================================
    /*
    const response = await axiosClient.post('/auth/staff/login', { email, password });
    const { accountId, token: newToken, roles: rawRoles } = response.data;
    
    const formattedRoles = rawRoles.map((role: string) => role.replace('ROLE_', ''));
    const loggedInUser: User = { accountId, email, roles: formattedRoles };

    setToken(newToken);
    setUser(loggedInUser);

    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    */
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};