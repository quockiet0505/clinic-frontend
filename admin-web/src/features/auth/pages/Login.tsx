import React from 'react';
import { Building2 } from 'lucide-react';
import LoginForm from '../components/LoginForm';

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 flex items-center justify-center p-4 font-sans">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl shadow-blue-100/50 border border-white">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-5">
            <img 
              src="http://localhost:8080/images/logo.png" 
              alt="Kiet Clinic" 
              className="w-50 object-contain"  
            />
          </div>
          <p className="text-slate-500 text-sm mt-1 font-medium">Cổng quản trị nhân viên</p>
        </div>

        {/* Form Component */}
        <LoginForm />
        
        {/* Footer Section */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400">
          <Building2 size={14} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Internal System Only</span>
        </div>

      </div>
    </div>
  );
}