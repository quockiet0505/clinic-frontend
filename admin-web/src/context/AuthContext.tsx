import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '@/features/auth/api/authApi';
import type { User } from '@/features/auth/types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('clinic_token');
    const storedUser = sessionStorage.getItem('clinic_user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = true) => {
    const res = await authApi.login(email, password);
    sessionStorage.setItem('clinic_token', res.token);
    sessionStorage.setItem('clinic_user', JSON.stringify(res.user));
    setUser(res.user);
  };

  const googleLogin = async (idToken: string) => {
    const res = await authApi.googleLogin(idToken);
    sessionStorage.setItem('clinic_token', res.token);
    sessionStorage.setItem('clinic_user', JSON.stringify(res.user));
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('clinic_token'); // Keep in case it exists from old version
    localStorage.removeItem('clinic_user');
    sessionStorage.removeItem('clinic_token');
    sessionStorage.removeItem('clinic_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, googleLogin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};