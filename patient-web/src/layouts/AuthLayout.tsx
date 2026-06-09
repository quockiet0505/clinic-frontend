import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

import { ImageWithFallback } from '@/components/common/ImageWithFallback';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex bg-gradient-white-blue relative">
      {/* Left side: Branding / Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-500 text-white relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-400 opacity-90 z-0"></div>
        
        {/* Ảnh nền với Fallback */}
        <div className="absolute inset-0 mix-blend-overlay opacity-30 z-0">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80" 
            alt="Clinic Background" 
            className="w-full h-full object-cover"
            containerClassName="w-full h-full"
          />
        </div>
        
        <div className="relative z-10">
          <Link to="/" className="inline-block">
             <div className="flex items-center gap-2 bg-white/20 p-3 rounded-2xl backdrop-blur-md w-fit border border-white/20 shadow-soft">
               <span className="font-bold text-xl tracking-tight text-white">CareClinic</span>
             </div>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-extrabold mb-6 leading-tight text-white drop-shadow-md">Sức khỏe của bạn là ưu tiên hàng đầu</h1>
          <p className="text-primary-50 text-lg leading-relaxed">
            Hệ thống đặt lịch trực tuyến nhanh chóng, tiện lợi và bảo mật. Trải nghiệm dịch vụ y tế chuẩn quốc tế ngay trong tầm tay.
          </p>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        <Link 
          to="/" 
          className="absolute top-6 left-6 lg:left-8 flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-primary-600 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại trang chủ
        </Link>
        
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 shadow-soft-lg sm:rounded-[2rem] border border-white">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};