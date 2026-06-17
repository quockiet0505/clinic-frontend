// features/profile/components/ProfileSecurityForm.tsx
import React, { useState } from 'react';
import { Eye, EyeOff, Lock, KeyRound, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import GradientButton from '@/components/common/GradientButton';

interface Props {
  passwordData: { current: string; new: string; confirm: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  saving?: boolean;
}

export default function ProfileSecurityForm({
  passwordData,
  onChange,
  onSave,
  saving = false,
}: Props) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = getPasswordStrength(passwordData.new);
  const strengthLabels = ['Yếu', 'Trung bình', 'Khá', 'Mạnh'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
  const strengthTextColors = ['text-red-500', 'text-orange-500', 'text-yellow-600', 'text-green-500'];

  const isPasswordValid = passwordData.new.length >= 6;
  const doPasswordsMatch = passwordData.new === passwordData.confirm && passwordData.new.length > 0;

  return (
    <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1 bg-white rounded-2xl border border-slate-200">
      <div>
        <h3 className="text-lg font-bold text-slate-800">Bảo mật & mật khẩu</h3>
        <p className="text-sm text-slate-500 mt-1">Đảm bảo tài khoản của bạn sử dụng mật khẩu mạnh và an toàn.</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Grid 2 cột */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hàng 1: Mật khẩu hiện tại - chiếm 1 cột (nửa chiều dài) */}
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

          {/* Hàng 1: khoảng trống bên phải (có thể thêm gì đó nếu muốn) */}
          <div className="hidden md:block"></div>

          {/* Hàng 2: Mật khẩu mới - cột 1 */}
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
            {passwordData.new.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength > 0 ? strengthColors[strength - 1] : 'bg-slate-200'
                      }`}
                      style={{ width: `${(strength / 4) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs font-semibold ${strength > 0 ? strengthTextColors[strength - 1] : 'text-slate-400'}`}>
                    {strength > 0 ? strengthLabels[strength - 1] : 'Nhập mật khẩu'}
                  </span>
                </div>
                <ul className="text-xs text-slate-500 space-y-0.5">
                  <li className={`flex items-center gap-1.5 ${passwordData.new.length >= 8 ? 'text-emerald-600' : ''}`}>
                    {passwordData.new.length >= 8 ? <Check size={12} /> : <X size={12} />}
                    Ít nhất 8 ký tự
                  </li>
                  <li className={`flex items-center gap-1.5 ${/[A-Z]/.test(passwordData.new) && /[a-z]/.test(passwordData.new) ? 'text-emerald-600' : ''}`}>
                    {/[A-Z]/.test(passwordData.new) && /[a-z]/.test(passwordData.new) ? <Check size={12} /> : <X size={12} />}
                    Chữ hoa và chữ thường
                  </li>
                  <li className={`flex items-center gap-1.5 ${/\d/.test(passwordData.new) ? 'text-emerald-600' : ''}`}>
                    {/\d/.test(passwordData.new) ? <Check size={12} /> : <X size={12} />}
                    Có ít nhất 1 số
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Hàng 2: Xác nhận mật khẩu mới - cột 2 */}
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
                className={`h-11 rounded-xl border-slate-200 bg-white pr-10 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 ${
                  passwordData.confirm && !doPasswordsMatch ? 'border-red-400 ring-2 ring-red-100' : ''
                } ${passwordData.confirm && doPasswordsMatch ? 'border-emerald-400 ring-2 ring-emerald-100' : ''}`}
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
            {passwordData.confirm && (
              <p className={`text-xs font-medium flex items-center gap-1.5 ${
                doPasswordsMatch ? 'text-emerald-600' : 'text-red-500'
              }`}>
                {doPasswordsMatch ? <Check size={14} /> : <X size={14} />}
                {doPasswordsMatch ? 'Mật khẩu khớp' : 'Mật khẩu không khớp'}
              </p>
            )}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <GradientButton
            onClick={onSave}
            disabled={saving || !isPasswordValid || !doPasswordsMatch || !passwordData.current}
            className="min-w-[160px]"
          >
            {saving ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
          </GradientButton>
        </div>
      </div>
    </div>
  );
}