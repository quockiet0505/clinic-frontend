import React, { useState } from 'react';
import { KeyRound, Loader2, ShieldAlert, Eye, EyeOff, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { profileApi } from '../api/profileApi';
import { toast } from 'sonner';

export const PasswordChangeForm: React.FC = () => {
  const [passwords, setPasswords] = useState({ oldPass: '', newPass: '', confirmPass: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleChange = (field: string, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (passwords.newPass !== passwords.confirmPass) {
      toast.error('Mật khẩu xác nhận không khớp!');
      setIsLoading(false);
      return;
    }

    try {
      await profileApi.changePassword({
        old_password: passwords.oldPass,
        new_password: passwords.newPass,
        confirm_password: passwords.confirmPass,
      });
      setPasswords({ oldPass: '', newPass: '', confirmPass: '' });
    } catch {
      /* toast: axios interceptor */
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <h4 className="text-[16px] font-bold text-slate-800">Đổi mật khẩu</h4>
        </div>
        
        <div className="flex flex-col gap-2 max-w-md mb-2">
          <label className="flex items-center gap-2 text-[14px] font-semibold text-slate-700">
            Mật khẩu hiện tại <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Input 
              required 
              type={showOldPass ? "text" : "password"} 
              value={passwords.oldPass} 
              onChange={e => handleChange('oldPass', e.target.value)} 
              className="h-11 rounded-xl border border-slate-200 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-[14.5px] font-medium transition-colors px-11" 
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
            <label className="flex items-center gap-2 text-[14px] font-semibold text-slate-700">
              Mật khẩu mới <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Input 
                required 
                type={showNewPass ? "text" : "password"} 
                value={passwords.newPass} 
                onChange={e => handleChange('newPass', e.target.value)} 
                className="h-11 rounded-xl border border-slate-200 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-[14.5px] font-medium transition-colors px-11" 
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
            <label className="flex items-center gap-2 text-[14px] font-semibold text-slate-700">
              Xác nhận mật khẩu <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Input 
                required 
                type={showConfirmPass ? "text" : "password"} 
                value={passwords.confirmPass} 
                onChange={e => handleChange('confirmPass', e.target.value)} 
                className="h-11 rounded-xl border border-slate-200 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-[14.5px] font-medium transition-colors px-11" 
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
        <Button disabled={isLoading} type="submit" className="bg-primary-500 hover:bg-primary-600 text-white rounded-xl h-11 px-8 font-bold shadow-sm transition-all cursor-pointer text-sm">
          {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang xử lý...</> : <><KeyRound className="w-4 h-4 mr-2" /> Cập nhật mật khẩu</>}
        </Button>
      </div>
    </form>
  );
};