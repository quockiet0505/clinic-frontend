import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';
import { RegisterForm } from '../components/RegisterForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Register: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background-light p-4">
      <Card className="w-full max-w-lg rounded-2xl shadow-lg border-0">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-3">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-black text-brand-dark">Đăng ký tài khoản</CardTitle>
          <p className="text-slate-500 text-sm mt-1">Tạo tài khoản bệnh nhân mới</p>
        </CardHeader>
        <CardContent className="pt-2 pb-6">
          <RegisterForm />
          <p className="mt-6 text-center text-slate-500 text-sm">
            Đã có tài khoản?{' '}
            <Link to="/auth/login" className="text-primary-500 font-bold hover:underline">
              Đăng nhập
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};