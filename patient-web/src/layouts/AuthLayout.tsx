import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      
      {/* Back button link redirecting to Landing Page */}
      <div className="absolute top-6 left-6">
        <Link 
          to="/" 
          className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-blue-600 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại trang chủ
        </Link>
      </div>

     

      {/* Center dynamic form registration container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-100 sm:rounded-2xl sm:px-10 border border-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};