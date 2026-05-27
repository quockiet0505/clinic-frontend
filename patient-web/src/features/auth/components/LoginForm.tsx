import React, { useState } from 'react';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

interface LoginFormProps {
  onSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      onSuccess();
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại!';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-5 w-full">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-600 text-[14px] font-medium border border-red-100">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-bold text-brand-dark">Email</label>
        <div className="relative">
          <Input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-14 rounded-2xl pl-12 bg-background-light border-border-default text-[15px] focus-visible:ring-primary-500/20 focus-visible:border-primary-500"
            placeholder="Nhập email của bạn"
          />
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="text-[14px] font-bold text-brand-dark">Mật khẩu</label>
          <a href="#" className="text-[13px] font-bold text-primary-500 hover:underline">
            Quên mật khẩu?
          </a>
        </div>
        <div className="relative">
          <Input
            required
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-14 rounded-2xl pl-12 pr-12 bg-background-light border-border-default text-[15px] focus-visible:ring-primary-500/20 focus-visible:border-primary-500"
            placeholder="Nhập mật khẩu"
          />
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <Button
        disabled={isLoading}
        type="submit"
        className="h-14 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-[15px] mt-4 shadow-md transition-all"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Đang đăng nhập...
          </>
        ) : (
          'Đăng nhập'
        )}
      </Button>
    </form>
  );
};