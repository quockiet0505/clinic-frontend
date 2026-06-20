/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef } from 'react';
import { Save, Loader2, User, CalendarDays, MapPin, Phone, Mail, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormTextarea } from '@/components/common/FormTextarea';
import { profileApi } from '../api/profileApi';
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
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (field: keyof UpdateProfilePayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await profileApi.updateMyProfile(formData);
      setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
      if (onSuccess) onSuccess();
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Cập nhật thất bại. Vui lòng thử lại.',
      });
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

      {/* Thông tin cơ bản */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <h4 className="text-[16px] font-bold text-slate-800">Thông tin cơ bản</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-600 uppercase tracking-wide">
              Họ và tên <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Input
                required
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className="h-12 rounded-xl pl-11 pr-4 text-[15px] font-medium border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 shadow-sm bg-slate-50/50 hover:bg-white transition-colors"
                placeholder="Nhập họ và tên..."
              />
              <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-600 uppercase tracking-wide">Giới tính</label>
            <div 
              className="w-full relative z-50"
              onMouseEnter={handleGenderMouseEnter}
              onMouseLeave={handleGenderMouseLeave}
            >
              <div className={`w-full h-12 flex items-center justify-between px-4 rounded-xl bg-slate-50/50 hover:bg-white border shadow-sm font-medium text-slate-700 cursor-pointer transition-colors ${isGenderOpen ? 'border-indigo-500 text-indigo-600 bg-white' : 'border-slate-200'}`}>
                <span className="text-[15px] font-medium">
                  {formData.gender === 'MALE' ? 'Nam' : formData.gender === 'FEMALE' ? 'Nữ' : formData.gender === 'OTHER' ? 'Khác' : <span className="text-slate-400">Chọn giới tính...</span>}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isGenderOpen ? 'rotate-180 text-indigo-500' : 'text-slate-400'}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
              <div className={`absolute left-0 right-0 top-full pt-2 transition-all duration-200 ${isGenderOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                <div className="rounded-xl bg-white border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] p-1.5 flex flex-col gap-1">
                  {[
                    { value: 'MALE', label: 'Nam' },
                    { value: 'FEMALE', label: 'Nữ' },
                    { value: 'OTHER', label: 'Khác' },
                  ].map(item => (
                    <div
                      key={item.value}
                      onClick={() => {
                         handleChange('gender', item.value);
                         setIsGenderOpen(false);
                      }}
                      className={`w-full text-left cursor-pointer py-2.5 px-4 text-[14.5px] rounded-lg transition-all ${
                        formData.gender === item.value ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-medium'
                      }`}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-600 uppercase tracking-wide">Ngày sinh</label>
            <div className="relative">
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                className="h-12 rounded-xl px-4 text-[15px] font-medium border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 shadow-sm bg-slate-50/50 hover:bg-white transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-slate-100"></div>

      {/* Thông tin liên hệ */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <Navigation className="w-4 h-4" />
          </div>
          <h4 className="text-[16px] font-bold text-slate-800">Thông tin liên hệ</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-600 uppercase tracking-wide">Số điện thoại</label>
            <div className="relative">
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="h-12 rounded-xl pl-11 pr-4 text-[15px] font-medium border-slate-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 shadow-sm bg-slate-50/50 hover:bg-white transition-colors"
                placeholder="Nhập số điện thoại..."
              />
              <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-600 uppercase tracking-wide">Email liên hệ</label>
            <div className="relative">
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="h-12 rounded-xl pl-11 pr-4 text-[15px] font-medium border-slate-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 shadow-sm bg-slate-50/50 hover:bg-white transition-colors"
                placeholder="Nhập email..."
              />
              <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col gap-2">
             <label className="text-[13px] font-bold text-slate-600 uppercase tracking-wide">Địa chỉ hiện tại</label>
             <div className="relative">
               <textarea
                 value={formData.address || ''}
                 onChange={(e) => handleChange('address', e.target.value)}
                 placeholder="Nhập địa chỉ (Số nhà, đường, phường/xã, quận/huyện...)"
                 className="w-full min-h-[110px] rounded-xl text-[15px] font-medium border border-slate-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 shadow-sm bg-slate-50/50 hover:bg-white transition-colors p-4 resize-y"
               />
             </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button disabled={isLoading} type="submit" className="bg-primary-500 hover:bg-primary-600 text-white rounded-xl h-12 px-8 font-bold shadow-sm shadow-primary-200 transition-all cursor-pointer text-[15px]">
          {isLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Đang xử lý...</> : <><Save className="w-5 h-5 mr-2" /> Lưu Thay Đổi</>}
        </Button>
      </div>
    </form>
  );
};