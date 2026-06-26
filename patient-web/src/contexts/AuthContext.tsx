/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useState } from 'react';
import type { RegisterRequest, User } from '@/features/auth/types/auth';
import { authApi } from '@/features/auth/api/authApi';
import { profileApi } from '@/features/profile/api/profileApi';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchFullUser = async (account: { accountId: number; email: string; roles: string[] }) => {
    try {
      const profile = await profileApi.getMyProfile();
      setUser({
        accountId: account.accountId,
        email: account.email,
        roles: account.roles,
        fullName: profile.fullName,
        phone: profile.phone,
        address: profile.address,
        gender: profile.gender,
        dateOfBirth: profile.dateOfBirth,
        patientId: profile.patientId,
      });
    } catch {
      // Fallback khi chưa có profile (mới đăng ký)
      setUser({
        accountId: account.accountId,
        email: account.email,
        roles: account.roles,
        fullName: account.email.split('@')[0],
      });
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const account = await authApi.getCurrentUser();
        await fetchFullUser(account);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = true) => {
    setLoading(true);
    try {
      await authApi.login(email, password, rememberMe);
      const account = await authApi.getCurrentUser();
      await fetchFullUser(account);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setLoading(true);
    try {
      await authApi.register(data);
      const account = await authApi.getCurrentUser();
      await fetchFullUser(account);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authApi.logout();
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};