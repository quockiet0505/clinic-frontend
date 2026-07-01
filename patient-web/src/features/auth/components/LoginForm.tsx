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
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu!');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password, rememberMe);
      onSuccess();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại!';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <form onSubmit={handleLogin} noValidate className="flex flex-col gap-4 w-full">
      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 animate-in fade-in zoom-in duration-300">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-brand-dark">Email <span className="text-red-500">*</span></label>
        <div className="relative">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-2xl pl-10 pr-4 bg-background-light border-border-default text-sm focus-visible:ring-primary-500/20 focus-visible:border-primary-500 cursor-text"
            placeholder="Nhập email của bạn"
          />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-brand-dark">Mật khẩu <span className="text-red-500">*</span></label>
          <a href="#" className="text-xs font-bold text-primary-500 hover:underline cursor-pointer">
            Quên mật khẩu?
          </a>
        </div>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-2xl pl-10 pr-10 bg-background-light border-border-default text-sm focus-visible:ring-primary-500/20 focus-visible:border-primary-500 cursor-text"
            placeholder="Nhập mật khẩu"
          />
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input 
          type="checkbox" 
          id="rememberMe" 
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-600 cursor-pointer"
        />
        <label htmlFor="rememberMe" className="text-sm font-bold text-slate-600 cursor-pointer select-none">
          Ghi nhớ đăng nhập
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="group relative w-full flex justify-center py-3.5 px-4 mt-2 border border-primary-500 rounded-2xl bg-transparent text-[15px] font-bold text-primary-600 overflow-hidden transition-all duration-300 hover:border-transparent hover:shadow-lg hover:shadow-primary-500/30 focus:outline-none focus:ring-4 focus:ring-primary-500/20 active:scale-[0.98] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative flex items-center group-hover:text-white transition-colors duration-300">
          {isLoading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
          {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </div>
      </button>
    </form>
  );
};