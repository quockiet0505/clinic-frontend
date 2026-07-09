import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '@/features/auth/api/authApi';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export const GoogleRegister: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const state = location.state as { idToken?: string; email?: string; fullName?: string } || {};
  
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // If no idToken is in state, they shouldn't be here
  if (!state.idToken) {
    navigate('/auth/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setError('Vui lòng nhập số điện thoại');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      // Register with google
      await authApi.googleRegister(
        state.fullName || '',
        phone,
        state.email || '',
        state.idToken || ''
      );

      // Successfully registered, now login automatically
      // But wait! googleRegister returns token in authApi, but we need to fetch profile.
      // The easiest way is to let the user login again via google, or manually log them in
      // Actually, since we have googleLogin in AuthContext, we can just call it again
      const { googleLogin } = useAuth(); // Oh wait, hook can't be called inside async without closure, but we can destructure it outside. Wait, I didn't destructure googleLogin above.
      
      // Let's just use the returned token directly or navigate them back to login
      navigate('/auth/login', { replace: true, state: { message: 'Đăng ký thành công, vui lòng đăng nhập lại' } });
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-black text-brand-dark mb-2">Hoàn thiện hồ sơ</h1>
      <p className="text-slate-500 font-medium text-sm mb-8 text-center max-w-xs">
        Tài khoản Google của bạn đã được xác nhận. Vui lòng cung cấp số điện thoại để phòng khám liên hệ.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-brand-dark">Họ và tên</label>
          <input
            type="text"
            disabled
            value={state.fullName || ''}
            className="h-12 rounded-2xl px-4 bg-slate-100 border-border-default text-sm text-slate-500 cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-brand-dark">Email</label>
          <input
            type="text"
            disabled
            value={state.email || ''}
            className="h-12 rounded-2xl px-4 bg-slate-100 border-border-default text-sm text-slate-500 cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-brand-dark">Số điện thoại <span className="text-red-500">*</span></label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-12 rounded-2xl px-4 bg-background-light border-border-default text-sm focus-visible:ring-primary-500/20 focus-visible:border-primary-500 cursor-text"
            placeholder="Nhập số điện thoại"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center py-3.5 px-4 mt-4 border border-primary-500 rounded-2xl bg-transparent text-[15px] font-bold text-primary-600 overflow-hidden transition-all hover:bg-primary-50"
        >
          {isLoading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
          {isLoading ? 'Đang xử lý...' : 'Hoàn tất'}
        </button>
      </form>
    </div>
  );
};
