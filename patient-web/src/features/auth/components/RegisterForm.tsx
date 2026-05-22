import React, { useState } from 'react';
import { Mail, Lock, User, Phone, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authApi } from '../api/authApi';

interface RegisterFormProps {
  onSuccess: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      setIsLoading(false);
      return;
    }

    try {
      await authApi.register(fullName, email, password, phone);
      onSuccess(); // Redirect to home page
    } catch (err) {
      setError(err.message || 'Đã có lỗi xảy ra khi đăng ký!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-5 w-full">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-600 text-[14px] font-medium border border-red-100">
          {error}
        </div>
      )}
      
      {/* Full Name - Mandatory field in 'patient' table */}
      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-bold text-[#003B5C]">Họ và tên <span className="text-red-500">*</span></label>
        <div className="relative">
          <Input required type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="h-14 rounded-2xl pl-12 bg-slate-50/50 border-slate-200 text-[15px] focus-visible:ring-[#00b5f1]/20 focus-visible:border-[#00b5f1]" placeholder="VD: Nguyễn Văn A" />
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>
      </div>

      {/* Phone - Optional field in 'patient' table */}
      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-bold text-[#003B5C]">Số điện thoại</label>
        <div className="relative">
          <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="h-14 rounded-2xl pl-12 bg-slate-50/50 border-slate-200 text-[15px] focus-visible:ring-[#00b5f1]/20 focus-visible:border-[#00b5f1]" placeholder="VD: 0901234567" />
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-bold text-[#003B5C]">Email <span className="text-red-500">*</span></label>
        <div className="relative">
          <Input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="h-14 rounded-2xl pl-12 bg-slate-50/50 border-slate-200 text-[15px] focus-visible:ring-[#00b5f1]/20 focus-visible:border-[#00b5f1]" placeholder="Nhập địa chỉ email" />
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-bold text-[#003B5C]">Mật khẩu <span className="text-red-500">*</span></label>
          <div className="relative">
            <Input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="h-14 rounded-2xl pl-12 bg-slate-50/50 border-slate-200 text-[15px] focus-visible:ring-[#00b5f1]/20 focus-visible:border-[#00b5f1]" placeholder="Tạo mật khẩu" />
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-bold text-[#003B5C]">Xác nhận mật khẩu <span className="text-red-500">*</span></label>
          <div className="relative">
            <Input required type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="h-14 rounded-2xl pl-12 bg-slate-50/50 border-slate-200 text-[15px] focus-visible:ring-[#00b5f1]/20 focus-visible:border-[#00b5f1]" placeholder="Nhập lại mật khẩu" />
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>

      <Button disabled={isLoading} type="submit" className="h-14 rounded-2xl bg-[#00b5f1] hover:bg-[#0098cc] text-white font-bold text-[15px] mt-4 shadow-md transition-all">
        {isLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Đang xử lý...</> : 'Tạo tài khoản'}
      </Button>
    </form>
  );
};