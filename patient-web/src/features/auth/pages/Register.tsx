import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';
import { RegisterForm } from '../components/RegisterForm';

export const Register: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-full">
      <Link to="/" className="flex-shrink-0 mb-4">
        <div className="scale-110">
          <Logo />
        </div>
      </Link>

      <h1 className="text-2xl font-black text-brand-dark mb-2">
        Đăng ký Bệnh nhân
      </h1>

      <p className="text-slate-500 font-medium text-sm mb-8">
        Tạo tài khoản để đặt lịch khám nhanh chóng
      </p>

      <div className="w-full max-w-lg">
        <RegisterForm />
      </div>

      <p className="mt-8 text-center text-slate-500 font-medium text-[14px]">
        Đã có tài khoản?{' '}
        <Link to="/auth/login" className="text-primary-500 font-bold hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
};