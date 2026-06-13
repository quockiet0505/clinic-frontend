import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ProfileSecurityForm({ passwordData, onChange, onSave }: any) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
      <div>
        <h3 className="text-lg font-black text-slate-900">Bảo mật & Mật khẩu</h3>
        <p className="text-sm font-medium text-slate-500 mt-1">Đảm bảo tài khoản của bạn sử dụng mật khẩu mạnh và an toàn.</p>
      </div>

      <div className="max-w-md space-y-5">
        {/* Mật khẩu hiện tại */}
        <div className="space-y-2">
          <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Mật khẩu hiện tại</label>
          <div className="relative">
            <Input 
              type={showCurrent ? "text" : "password"} 
              name="current" 
              value={passwordData.current} 
              onChange={onChange} 
              className="h-11 rounded-xl bg-slate-50 pr-10 font-bold text-slate-700" 
              placeholder="••••••••" 
            />
            <button 
              type="button" 
              onClick={() => setShowCurrent(!showCurrent)} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        <div className="h-px w-full bg-slate-100 my-4"></div>

        {/* Mật khẩu mới  */}
        <div className="space-y-2">
          <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Mật khẩu mới</label>
          <div className="relative">
            <Input 
              type={showNew ? "text" : "password"} 
              name="new" 
              value={passwordData.new} 
              onChange={onChange} 
              className="h-11 rounded-xl bg-slate-50 pr-10 font-bold text-slate-700" 
              placeholder="" 
            />
            <button 
              type="button" 
              onClick={() => setShowNew(!showNew)} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Xác nhận mật khẩu mới</label>
          <div className="relative">
            <Input 
              type={showConfirm ? "text" : "password"} 
              name="confirm" 
              value={passwordData.confirm} 
              onChange={onChange} 
              className="h-11 rounded-xl bg-slate-50 pr-10 font-bold text-slate-700" 
              placeholder="" 
            />
            <button 
              type="button" 
              onClick={() => setShowConfirm(!showConfirm)} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button 
            onClick={onSave} 
            className="h-11 rounded-xl bg-primary-600 hover:bg-primary-700 shadow-md hover:shadow-lg text-white font-bold px-8 shadow-sm transition-all cursor-pointer"
          >
            Cập Nhật Mật Khẩu
          </Button>
        </div>

      </div>
    </div>
  );
}