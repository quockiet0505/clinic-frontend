import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, LogIn, Eye, EyeOff } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { auth, googleProvider, signInWithPopup } from '@/config/firebase';

const loginSchema = z.object({
  email: z.string({ message: 'Please enter your email address' })
    .min(1, 'Please enter your email address')
    .email('Invalid email format'),
  password: z.string({ message: 'Please enter your password' })
    .min(6, 'Password must contain at least 6 characters'),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: true },
  });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    try {
      await login(values.email, values.password, values.rememberMe);
      navigate('/dashboard');
    } catch (error: any) {
      setServerError(error.response?.data?.message || 'Authentication failed. Please check your credentials.');
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setServerError(null);
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      await googleLogin(idToken);
      navigate('/dashboard');
    } catch (error: any) {
      console.error(error);
      setServerError(error.message || 'Đăng nhập Google thất bại');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" autoComplete="off">
      
      {serverError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold border border-red-100 text-center">
          {serverError}
        </div>
      )}

      <Field data-invalid={!!errors.email}>
        <FieldLabel className="font-bold text-slate-700">Email Address</FieldLabel>
        <Input 
          type="email"
          placeholder="admin@clinic.vn" 
          {...register('email')} 
          aria-invalid={!!errors.email}
          autoComplete="off"
          className="rounded-xl h-11 bg-slate-50 transition-all placeholder:text-slate-400" 
        />
        {errors.email && <FieldError className="text-xs font-bold text-red-500">{errors.email.message}</FieldError>}
      </Field>

      <Field data-invalid={!!errors.password}>
        <FieldLabel className="font-bold text-slate-700">Password</FieldLabel>
        <div className="relative">
          <Input 
            type={showPassword ? "text" : "password"} 
            placeholder="e.g., Trustcare@2026" 
            {...register('password')} 
            aria-invalid={!!errors.password}
            autoComplete="new-password"
            className="rounded-xl h-11 bg-slate-50 transition-all placeholder:text-slate-400 pr-10 tracking-widest" 
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <FieldError className="text-xs font-bold text-red-500">{errors.password.message}</FieldError>}
      </Field>

      <div className="flex items-center space-x-2">
        <input 
          type="checkbox" 
          id="rememberMe" 
          {...register('rememberMe')} 
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
        />
        <label htmlFor="rememberMe" className="text-sm font-bold text-slate-600 cursor-pointer select-none">
          Remember me for 30 days
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="group relative w-full flex justify-center py-3.5 px-4 border border-primary-500 rounded-xl bg-transparent text-[15px] font-bold text-primary-600 overflow-hidden transition-all duration-300 hover:border-transparent hover:shadow-lg hover:shadow-primary-500/30 focus:outline-none focus:ring-4 focus:ring-primary-500/20 active:scale-[0.98] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative flex items-center group-hover:text-white transition-colors duration-300">
          {isSubmitting ? <Loader2 className="animate-spin mr-2" size={18} /> : <LogIn className="mr-2" size={18} />}
          {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập vào hệ thống'}
        </div>
      </button>
      
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-slate-500 font-medium">Hoặc</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="relative w-full flex justify-center items-center gap-3 py-3.5 px-4 border border-slate-200 rounded-xl bg-white text-[15px] font-bold text-slate-700 transition-all duration-300 hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-100 active:scale-[0.98] cursor-pointer"
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
}