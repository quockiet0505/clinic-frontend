import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';
import { LoginForm } from '../components/LoginForm';

export const Login: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center">
      <Link to="/" className="flex-shrink-0 mb-4">
        <div className="scale-110">  {/* tăng logo lên 10% */}
          <Logo />
        </div>
      </Link>
      <h1 className="text-2xl font-black text-brand-dark mb-2">Đăng nhập Bệnh nhân</h1>
      <p className="text-slate-500 font-medium text-sm mb-8">Vui lòng đăng nhập để tiếp tục</p>
      
      <LoginForm onSuccess={() => navigate('/')} />

      <p className="mt-8 text-center text-slate-500 font-medium text-[14px]">
        Chưa có tài khoản? <Link to="/auth/register" className="text-primary-500 font-bold hover:underline">Đăng ký ngay</Link>
      </p>
    </div>
  );
};