import React, { useState } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authApi } from '../api/authApi';

interface LoginFormProps {
  onSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('benhnhan@gmail.com');
  const [password, setPassword] = useState('123456');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await authApi.login(email, password);
      onSuccess(); // Redirect to home page
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-5 w-full">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-600 text-[14px] font-medium border border-red-100">
          {error}
        </div>
      )}
      
      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-bold text-[#003B5C]">Email</label>
        <div className="relative">
          <Input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="h-14 rounded-2xl pl-12 bg-slate-50/50 border-slate-200 text-[15px] focus-visible:ring-[#00b5f1]/20 focus-visible:border-[#00b5f1]" placeholder="Nhập email của bạn" />
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="text-[14px] font-bold text-[#003B5C]">Mật khẩu</label>
          <a href="#" className="text-[13px] font-bold text-[#00b5f1] hover:underline">Quên mật khẩu?</a>
        </div>
        <div className="relative">
          <Input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="h-14 rounded-2xl pl-12 bg-slate-50/50 border-slate-200 text-[15px] focus-visible:ring-[#00b5f1]/20 focus-visible:border-[#00b5f1]" placeholder="Nhập mật khẩu" />
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>
      </div>

      <Button disabled={isLoading} type="submit" className="h-14 rounded-2xl bg-[#00b5f1] hover:bg-[#0098cc] text-white font-bold text-[15px] mt-4 shadow-md transition-all">
        {isLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Đang đăng nhập...</> : 'Đăng nhập'}
      </Button>
    </form>
  );
};