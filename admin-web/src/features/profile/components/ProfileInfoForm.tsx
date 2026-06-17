// features/profile/components/ProfileInfoForm.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import CustomSelect from '@/components/common/CustomSelect';
import GradientButton from '@/components/common/GradientButton';
import { User, Mail, Phone, MapPin, Calendar, Users } from 'lucide-react';
import { UserProfile } from '../types/profile';

interface Props {
  formData: UserProfile;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSave: () => void;
  saving?: boolean;
}

export default function ProfileInfoForm({ formData, onChange, onSave, saving = false }: Props) {
  return (
    <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1 bg-white rounded-2xl border border-slate-200">
      <div>
        <h3 className="text-lg font-bold text-slate-800">Thông tin cá nhân</h3>
        <p className="text-sm text-slate-500 mt-1">Cập nhật thông tin hồ sơ cơ bản của bạn.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Users size={16} className="text-blue-500" /> Họ và tên
          </label>
          <Input
            name="fullName"
            placeholder="Nhập họ và tên..."
            value={formData.fullName}
            onChange={onChange}
            className="h-11 rounded-xl border-slate-200 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Users size={16} className="text-blue-500" /> Giới tính
          </label>
          <CustomSelect
            name="gender"
            value={formData.gender}
            onChange={onChange}
            className="h-11 rounded-xl border-slate-200"
          >
            <option value="MALE">Nam</option>
            <option value="FEMALE">Nữ</option>
            <option value="OTHER">Khác</option>
          </CustomSelect>
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Calendar size={16} className="text-blue-500" /> Ngày sinh
          </label>
          <Input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={onChange}
            className="h-11 rounded-xl border-slate-200 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Phone size={16} className="text-emerald-500" /> Số điện thoại
          </label>
          <Input
            name="phone"
            placeholder="Nhập số điện thoại..."
            value={formData.phone}
            onChange={onChange}
            className="h-11 rounded-xl border-slate-200 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Mail size={16} className="text-indigo-500" /> Email
          </label>
          <Input
            type="email"
            name="email"
            placeholder="example@domain.com"
            value={formData.email}
            onChange={onChange}
            className="h-11 rounded-xl border-slate-200 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <MapPin size={16} className="text-amber-500" /> Địa chỉ
          </label>
          <Input
            name="address"
            placeholder="Nhập địa chỉ của bạn..."
            value={formData.address}
            onChange={onChange}
            className="h-11 rounded-xl border-slate-200 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <GradientButton onClick={onSave} disabled={saving}>
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </GradientButton>
      </div>
    </div>
  );
}