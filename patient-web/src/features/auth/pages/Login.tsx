import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { homeApi } from '@/features/home/api/homeApi';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [logoUrl, setLogoUrl] = useState('/images/logo.png');

  useEffect(() => {
    homeApi.getLogo()
      .then(url => setLogoUrl(url))
      .catch(() => console.error('Failed to load logo'));
  }, []);

  return (
    <div className="flex flex-col items-center">
      <Link to="/" className="flex-shrink-0 mb-4">
        <div className="scale-110">
          <img src={logoUrl} alt="Clinic Logo" className="h-10" />
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