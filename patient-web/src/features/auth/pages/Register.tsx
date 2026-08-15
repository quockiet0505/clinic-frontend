import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RegisterForm } from '../components/RegisterForm';
import { homeApi } from '@/features/home/api/homeApi';

export const Register: React.FC = () => {
  const [logoUrl, setLogoUrl] = useState('/images/logo.png');

  useEffect(() => {
    homeApi.getLogo()
      .then(url => setLogoUrl(url))
      .catch(() => console.error('Failed to load logo'));
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <Link to="/" className="flex-shrink-0 mb-2">
        <div className="scale-110">
          <img src={logoUrl} alt="Clinic Logo" className="h-10" />
        </div>
      </Link>

      <h1 className="text-2xl font-black text-brand-dark mb-2">
        Đăng ký Bệnh nhân
      </h1>

      <p className="text-slate-500 font-medium text-sm mb-4">
        Tạo tài khoản để đặt lịch khám nhanh chóng
      </p>

      <div className="w-full max-w-lg">
        <RegisterForm />
      </div>

      <p className="mt-5 text-center text-slate-500 font-medium text-[14px]">
        Đã có tài khoản?{' '}
        <Link to="/auth/login" className="text-primary-500 font-bold hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
};