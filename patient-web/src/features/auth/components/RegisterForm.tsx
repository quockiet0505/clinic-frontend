import React, { useState } from 'react';
import { Mail, Lock, User, Phone, Loader2, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const RegisterForm: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('MALE');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setError('');
    if (!fullName || !phone || !email || !dateOfBirth || !address) {
      setError('Vui lòng nhập đầy đủ tất cả thông tin cá nhân!');
      return;
    }
    setStep(2);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!password || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ mật khẩu!');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    setIsLoading(true);

    try {
      await register({ fullName, email, password, phone, gender, dateOfBirth, address });
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
    <form onSubmit={handleRegister} noValidate className="flex flex-col gap-4 w-full">
      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 animate-in fade-in zoom-in duration-300">
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-4 animate-in slide-in-from-right-4 duration-300">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-brand-dark">Họ và tên <span className="text-red-500">*</span></label>
            <div className="relative">
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-12 rounded-2xl pl-10 pr-4 bg-background-light border-border-default text-sm focus-visible:ring-primary-500/20 focus-visible:border-primary-500 cursor-text"
                placeholder="VD: Nguyễn Văn A"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-brand-dark">Số điện thoại <span className="text-red-500">*</span></label>
            <div className="relative">
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-12 rounded-2xl pl-10 pr-4 bg-background-light border-border-default text-sm focus-visible:ring-primary-500/20 focus-visible:border-primary-500 cursor-text"
                placeholder="VD: 0901234567"
              />
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-brand-dark">Email <span className="text-red-500">*</span></label>
            <div className="relative">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-2xl pl-10 pr-4 bg-background-light border-border-default text-sm focus-visible:ring-primary-500/20 focus-visible:border-primary-500 cursor-text"
                placeholder="Nhập địa chỉ email"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-sm font-bold text-brand-dark">Giới tính <span className="text-red-500">*</span></label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="h-12 rounded-2xl px-4 bg-background-light border-border-default text-sm focus-visible:ring-primary-500/20 focus-visible:border-primary-500 cursor-pointer outline-none border"
              >
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-sm font-bold text-brand-dark">Ngày sinh <span className="text-red-500">*</span></label>
              <Input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="h-12 rounded-2xl px-4 bg-background-light border-border-default text-sm focus-visible:ring-primary-500/20 focus-visible:border-primary-500 cursor-text"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-brand-dark">Địa chỉ <span className="text-red-500">*</span></label>
            <Input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-12 rounded-2xl px-4 bg-background-light border-border-default text-sm focus-visible:ring-primary-500/20 focus-visible:border-primary-500 cursor-text"
              placeholder="VD: 123 Đường A, Quận 1, TP HCM"
            />
          </div>

          <Button
            type="button"
            onClick={handleNextStep}
            className="h-12 rounded-2xl bg-primary-500 hover:bg-gradient-to-r hover:from-primary-600 hover:to-primary-400 text-white font-bold text-sm mt-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group"
          >
            Tiếp theo 
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-4 animate-in slide-in-from-right-4 duration-300">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-brand-dark">Mật khẩu <span className="text-red-500">*</span></label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-2xl pl-10 pr-10 bg-background-light border-border-default text-sm focus-visible:ring-primary-500/20 focus-visible:border-primary-500 cursor-text"
                placeholder="Tạo mật khẩu"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-brand-dark">Xác nhận mật khẩu <span className="text-red-500">*</span></label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 rounded-2xl pl-10 pr-10 bg-background-light border-border-default text-sm focus-visible:ring-primary-500/20 focus-visible:border-primary-500 cursor-text"
                placeholder="Nhập lại mật khẩu"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <button
                type="button"
                onClick={toggleConfirmPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <Button
              type="button"
              onClick={() => setStep(1)}
              className="h-12 flex-1 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
            </Button>
            <Button
              disabled={isLoading}
              type="submit"
              className="h-12 flex-1 rounded-2xl bg-primary-500 hover:bg-gradient-to-r hover:from-primary-600 hover:to-primary-400 text-white font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang xử lý...</>
              ) : (
                'Tạo tài khoản'
              )}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};