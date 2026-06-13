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
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    try {
      await login(values.email, values.password);
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
          className="rounded-xl h-11 bg-slate-50 focus:bg-white transition-all placeholder:text-slate-400" 
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
            className="rounded-xl h-11 bg-slate-50 focus:bg-white transition-all placeholder:text-slate-400 pr-10 tracking-widest" 
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors focus:outline-none"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <FieldError className="text-xs font-bold text-red-500">{errors.password.message}</FieldError>}
      </Field>

      <Button 
        type="submit" 
        disabled={isSubmitting} 
        className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg font-bold text-md shadow-md shadow-blue-100 mt-4 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? <Loader2 className="animate-spin mr-2" size={18} /> : <LogIn className="mr-2" size={18} />}
        {isSubmitting ? 'Authenticating...' : 'Sign In'}
      </Button>
      
    </form>
  );
}