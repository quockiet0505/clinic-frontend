import React from 'react';
import { Stethoscope, Building2 } from 'lucide-react';
import LoginForm from '../components/LoginForm';

export default function Login() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl shadow-slate-200 border border-slate-100">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-200">
            <Stethoscope size={36} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Preclinic Portal</h1>
          <p className="text-slate-500 text-sm">Staff & Administrator Access</p>
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