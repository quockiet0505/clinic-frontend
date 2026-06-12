import React, { useState } from 'react';
import { KeyRound, Loader2, ShieldAlert, Eye, EyeOff, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { profileApi } from '../api/profileApi';

export const PasswordChangeForm: React.FC = () => {
  const [passwords, setPasswords] = useState({ oldPass: '', newPass: '', confirmPass: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

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
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Đổi mật khẩu thất bại' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {message.text && (
        <div className={`p-4 rounded-xl text-[14.5px] font-bold flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
          <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
          {message.text}
        </div>
      )}

      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <h4 className="text-[16px] font-bold text-slate-800">Đổi mật khẩu</h4>
        </div>
        
        <div className="flex flex-col gap-2 max-w-md mb-2">
          <label className="text-[13px] font-bold text-slate-600 uppercase tracking-wide">
            Mật khẩu hiện tại <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Input 
              required 
              type={showOldPass ? "text" : "password"} 
              value={passwords.oldPass} 
              onChange={e => handleChange('oldPass', e.target.value)} 
              className="h-12 rounded-xl pl-11 pr-11 text-[15px] font-medium border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 shadow-sm bg-slate-50/50 hover:bg-white transition-colors" 
              placeholder="Nhập mật khẩu hiện tại..."
            />
            <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <button 
              type="button" 
              onClick={() => setShowOldPass(!showOldPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors"
            >
              {showOldPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-600 uppercase tracking-wide">
              Mật khẩu mới <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Input 
                required 
                type={showNewPass ? "text" : "password"} 
                value={passwords.newPass} 
                onChange={e => handleChange('newPass', e.target.value)} 
                className="h-12 rounded-xl pl-11 pr-11 text-[15px] font-medium border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 shadow-sm bg-slate-50/50 hover:bg-white transition-colors" 
                placeholder="Nhập mật khẩu mới..."
              />
              <KeyRound className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <button 
                type="button" 
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors"
              >
                {showNewPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-600 uppercase tracking-wide">
              Xác nhận mật khẩu <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Input 
                required 
                type={showConfirmPass ? "text" : "password"} 
                value={passwords.confirmPass} 
                onChange={e => handleChange('confirmPass', e.target.value)} 
                className="h-12 rounded-xl pl-11 pr-11 text-[15px] font-medium border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 shadow-sm bg-slate-50/50 hover:bg-white transition-colors" 
                placeholder="Nhập lại mật khẩu..."
              />
              <KeyRound className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <button 
                type="button" 
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors"
              >
                {showConfirmPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-slate-100"></div>

      <div className="flex justify-end mt-2">
        <Button disabled={isLoading} type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl h-12 px-8 font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer text-[15px]">
          {isLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Đang xử lý...</> : <><KeyRound className="w-5 h-5 mr-2" /> Cập nhật mật khẩu</>}
        </Button>
      </div>
    </form>
  );
};