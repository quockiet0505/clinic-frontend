/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef } from 'react';
import { Save, Loader2, User, CalendarDays, MapPin, Phone, Mail, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormTextarea } from '@/components/common/FormTextarea';
import { profileApi } from '../api/profileApi';
import { toast } from 'sonner';
import type { PatientProfile, UpdateProfilePayload } from '../types/profile';

interface ProfileInfoFormProps {
  initialData: PatientProfile;
  onSuccess?: () => void;
}

export const ProfileInfoForm: React.FC<ProfileInfoFormProps> = ({ initialData, onSuccess }) => {
  const [formData, setFormData] = useState<UpdateProfilePayload>({
    fullName: initialData.fullName,
    phone: initialData.phone || '',
    email: initialData.email || '',
    gender: initialData.gender || '',
    dateOfBirth: initialData.dateOfBirth || '',
    address: initialData.address || '',
    height: initialData.height ?? null,
    weight: initialData.weight ?? null,
    bloodPressure: initialData.bloodPressure ?? null,
    pulse: initialData.pulse ?? null,
    bloodType: initialData.bloodType ?? null,
    allergies: initialData.allergies ?? null,
    medicalHistory: initialData.medicalHistory ?? null,
  });

  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const genderTimeoutRef = useRef<NodeJS.Timeout>();

  const handleGenderMouseEnter = () => {
    if (genderTimeoutRef.current) clearTimeout(genderTimeoutRef.current);
    setIsGenderOpen(true);
  };

  const handleGenderMouseLeave = () => {
    genderTimeoutRef.current = setTimeout(() => setIsGenderOpen(false), 150);
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof UpdateProfilePayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await profileApi.updateMyProfile(formData);
      toast.success(res?.message || 'Cập nhật thông tin thành công!');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Cập nhật thông tin thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-bold text-slate-800">Thông tin cá nhân</h3>
        <p className="text-sm text-slate-500 mt-1">Cập nhật thông tin hồ sơ cơ bản của bạn.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <User size={16} className="text-blue-500" /> Họ và tên
          </label>
          <Input
            required
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-[14.5px] font-medium transition-colors"
            placeholder="Nhập họ và tên..."
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <User size={16} className="text-blue-500" /> Giới tính
          </label>
          <select
            value={formData.gender || ''}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-[14.5px] font-medium hover:border-blue-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-colors"
          >
            <option value="">Chọn giới tính...</option>
            <option value="MALE">Nam</option>
            <option value="FEMALE">Nữ</option>
            <option value="OTHER">Khác</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <CalendarDays size={16} className="text-blue-500" /> Ngày sinh
          </label>
          <Input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-[14.5px] font-medium transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Phone size={16} className="text-emerald-500" /> Số điện thoại
          </label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-[14.5px] font-medium transition-colors"
            placeholder="Nhập số điện thoại..."
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Mail size={16} className="text-indigo-500" /> Email
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-[14.5px] font-medium transition-colors"
            placeholder="example@domain.com"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <MapPin size={16} className="text-amber-500" /> Địa chỉ
          </label>
          <Input
            value={formData.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-[14.5px] font-medium transition-colors"
            placeholder="Nhập địa chỉ..."
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button disabled={isLoading} type="submit" className="bg-primary-500 hover:bg-primary-600 text-white rounded-xl h-11 px-8 font-bold shadow-sm transition-all cursor-pointer text-sm">
          {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang xử lý...</> : <><Save className="w-4 h-4 mr-2" /> Lưu Thay Đổi</>}
        </Button>
      </div>
    </form>
  );
};