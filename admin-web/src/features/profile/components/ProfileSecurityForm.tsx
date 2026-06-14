import React, { useState } from 'react';
import { Eye, EyeOff, Lock, KeyRound } from 'lucide-react';
import { Input } from '@/components/ui/input';
import GradientButton from '@/components/common/GradientButton';

export default function ProfileSecurityForm({ passwordData, onChange, onSave }: any) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1 bg-white rounded-2xl border border-slate-200">
      <div>
        <h3 className="text-lg font-bold text-slate-800">Bảo mật & mật khẩu</h3>
        <p className="text-sm text-slate-500 mt-1">Đảm bảo tài khoản của bạn sử dụng mật khẩu mạnh và an toàn.</p>
      </div>

      <div className="max-w-md space-y-5">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Lock size={16} className="text-blue-500" /> Mật khẩu hiện tại
          </label>
          <div className="relative">
            <Input
              type={showCurrent ? 'text' : 'password'}
              name="current"
              value={passwordData.current}
              onChange={onChange}
              className="h-11 rounded-xl border-slate-200 bg-white pr-10 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
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

        <div className="h-px w-full bg-slate-100"></div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <KeyRound size={16} className="text-emerald-500" /> Mật khẩu mới
          </label>
          <div className="relative">
            <Input
              type={showNew ? 'text' : 'password'}
              name="new"
              value={passwordData.new}
              onChange={onChange}
              className="h-11 rounded-xl border-slate-200 bg-white pr-10 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              placeholder="••••••••"
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
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <KeyRound size={16} className="text-emerald-500" /> Xác nhận mật khẩu mới
          </label>
          <div className="relative">
            <Input
              type={showConfirm ? 'text' : 'password'}
              name="confirm"
              value={passwordData.confirm}
              onChange={onChange}
              className="h-11 rounded-xl border-slate-200 bg-white pr-10 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              placeholder="••••••••"
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
          <GradientButton onClick={onSave}>
            Cập nhật mật khẩu
          </GradientButton>
        </div>
      </div>
    </div>
  );
}