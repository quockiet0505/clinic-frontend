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
  const { login } = useAuth();
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
      
    </form>
  );
}