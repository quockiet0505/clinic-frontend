import React, { useState } from 'react';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { auth, googleProvider, signInWithPopup } from '@/config/firebase';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
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

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError('');
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      const res = await googleLogin(idToken);
      
      if (res?.requiresRegistration) {
        // Navigate to Google Register screen to finish profile
        navigate('/auth/google-register', { state: { 
          idToken, 
          email: res.data.email, 
          fullName: res.data.name 
        } });
      } else if (res?.success) {
        onSuccess();
      }
    } catch (err: any) {
      console.error(err);
      setError('Đăng nhập Google thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <form onSubmit={handleLogin} noValidate className="flex flex-col gap-3 w-full">
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
        className="group relative w-full flex justify-center py-2.5 px-4 mt-2 border border-primary-500 rounded-2xl bg-transparent text-[15px] font-bold text-primary-600 overflow-hidden transition-all duration-300 hover:border-transparent hover:shadow-lg hover:shadow-primary-500/30 focus:outline-none focus:ring-4 focus:ring-primary-500/20 active:scale-[0.98] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative flex items-center group-hover:text-white transition-colors duration-300">
          {isLoading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
          {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </div>
      </button>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-slate-500 font-medium">Hoặc</span>
        </div>
      </div>

      <button
        type="button"
        disabled={isLoading}
        onClick={handleGoogleLogin}
        className="relative w-full flex justify-center items-center gap-3 py-2.5 px-4 border border-slate-200 rounded-2xl bg-white text-[15px] font-bold text-slate-700 transition-all duration-300 hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-100 active:scale-[0.98] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
          <path d="M1 1h22v22H1z" fill="none" />
        </svg>
        Đăng nhập bằng Google
      </button>
    </form>
  );
};