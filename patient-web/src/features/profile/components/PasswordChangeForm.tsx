import React, { useState } from 'react';
import { KeyRound, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { profileApi } from '../api/profileApi';

export const PasswordChangeForm: React.FC = () => {
  const [passwords, setPasswords] = useState({ oldPass: '', newPass: '', confirmPass: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (field: string, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    if (passwords.newPass !== passwords.confirmPass) {
      setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp!' });
      setIsLoading(false);
      return;
    }

    try {
      const res = await profileApi.changePassword({
        old_password: passwords.oldPass,
        new_password: passwords.newPass,
        confirm_password: passwords.confirmPass,
      });
      setMessage({ type: 'success', text: res.message });
      setPasswords({ oldPass: '', newPass: '', confirmPass: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Đổi mật khẩu thất bại' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-xl">
      {message.text && (
        <div className={`p-4 rounded-xl text-[14px] font-medium border ${message.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-bold text-brand-dark">Mật khẩu hiện tại <span className="text-red-500">*</span></label>
        <Input required type="password" value={passwords.oldPass} onChange={e => handleChange('oldPass', e.target.value)} className="h-11 rounded-xl px-4 border-slate-200 focus-visible:ring-primary-500/20 focus-visible:border-primary-500 shadow-sm" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-bold text-brand-dark">Mật khẩu mới <span className="text-red-500">*</span></label>
        <Input required type="password" value={passwords.newPass} onChange={e => handleChange('newPass', e.target.value)} className="h-11 rounded-xl px-4 border-slate-200 focus-visible:ring-primary-500/20 focus-visible:border-primary-500 shadow-sm" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-bold text-brand-dark">Xác nhận mật khẩu mới <span className="text-red-500">*</span></label>
        <Input required type="password" value={passwords.confirmPass} onChange={e => handleChange('confirmPass', e.target.value)} className="h-11 rounded-xl px-4 border-slate-200 focus-visible:ring-primary-500/20 focus-visible:border-primary-500 shadow-sm" />
      </div>

      <div className="pt-2 flex justify-end">
        <Button disabled={isLoading} type="submit" className="bg-primary-500 hover:bg-primary-600 text-white rounded-xl h-11 px-8 font-bold shadow-sm transition-all cursor-pointer">
          {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang xử lý...</> : <><KeyRound className="w-4 h-4 mr-2" /> Lưu thay đổi</>}
        </Button>
      </div>
    </form>
  );
};