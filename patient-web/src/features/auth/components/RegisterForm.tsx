import React, { useState } from 'react';
import { Mail, Lock, User, Phone, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const RegisterForm: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      await register({ fullName, email, password, phone });
      // Chuyển hướng sang trang đăng nhập
      navigate('/auth/login');
    } catch (err: unknown) {
      const errorResponse = err as { response?: { data?: { error?: string; message?: string } } };
      const errorMessage =
        errorResponse.response?.data?.error ||
        errorResponse.response?.data?.message ||
        'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin!';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-5 w-full">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-600 text-[14px] font-medium border border-red-100">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-bold text-brand-dark">Họ và tên <span className="text-red-500">*</span></label>
        <div className="relative">
          <Input
            required
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-14 rounded-2xl pl-12 bg-background-light border-border-default text-[15px]"
            placeholder="VD: Nguyễn Văn A"
          />
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-bold text-brand-dark">Số điện thoại</label>
        <div className="relative">
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-14 rounded-2xl pl-12 bg-background-light border-border-default text-[15px]"
            placeholder="VD: 0901234567"
          />
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-bold text-brand-dark">Email <span className="text-red-500">*</span></label>
        <div className="relative">
          <Input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-14 rounded-2xl pl-12 bg-background-light border-border-default text-[15px]"
            placeholder="Nhập địa chỉ email"
          />
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-bold text-brand-dark">Mật khẩu <span className="text-red-500">*</span></label>
        <div className="relative">
          <Input
            required
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-14 rounded-2xl pl-12 pr-12 bg-background-light border-border-default text-[15px]"
            placeholder="Tạo mật khẩu"
          />
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-bold text-brand-dark">Xác nhận <span className="text-red-500">*</span></label>
        <div className="relative">
          <Input
            required
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-14 rounded-2xl pl-12 pr-12 bg-background-light border-border-default text-[15px]"
            placeholder="Nhập lại mật khẩu"
          />
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <button
            type="button"
            onClick={toggleConfirmPassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <Button
        disabled={isLoading}
        type="submit"
        className="h-14 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-[15px] mt-4 shadow-md transition-all"
      >
        {isLoading ? (
          <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Đang xử lý...</>
        ) : (
          'Tạo tài khoản'
        )}
      </Button>
    </form>
  );
};