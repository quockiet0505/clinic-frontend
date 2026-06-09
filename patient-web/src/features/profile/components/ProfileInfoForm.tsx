/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef } from 'react';
import { Save, Loader2 } from 'lucide-react';
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
    full_name: initialData.full_name,
    phone: initialData.phone || '',
    email: initialData.email || '',
    gender: initialData.gender || '',
    date_of_birth: initialData.date_of_birth || '',
    address: initialData.address || '',
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
      await profileApi.updateProfile(formData);
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {message.text && (
        <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-6">
        <h4 className="text-[15px] font-bold text-brand-dark mb-2">Thông tin cơ bản</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-brand-dark">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <Input
              required
              value={formData.full_name}
              onChange={(e) => handleChange('full_name', e.target.value)}
              className="h-11 rounded-xl px-4 text-[14.5px] border-slate-200 focus-visible:ring-primary-500/20 focus-visible:border-primary-500 shadow-sm bg-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-brand-dark">Giới tính</label>
            <div 
              className="w-full relative z-50"
              onMouseEnter={handleGenderMouseEnter}
              onMouseLeave={handleGenderMouseLeave}
            >
              <div className={`w-full h-11 flex items-center justify-between px-4 rounded-xl bg-white border shadow-sm font-medium text-slate-700 cursor-pointer transition-colors ${isGenderOpen ? 'border-primary-500 text-primary-600' : 'border-slate-200'}`}>
                <span className="text-[14.5px] font-normal">
                  {formData.gender === 'MALE' ? 'Nam' : formData.gender === 'FEMALE' ? 'Nữ' : formData.gender === 'OTHER' ? 'Khác' : <span className="text-slate-500">Chọn giới tính</span>}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isGenderOpen ? 'rotate-180 text-primary-500' : 'text-slate-400'}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
              <div className={`absolute left-0 right-0 top-full pt-1 transition-all duration-200 ${isGenderOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                <div className="rounded-xl bg-white border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] p-1 flex flex-col gap-0.5">
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
                      className={`w-full text-left cursor-pointer py-2 px-3 text-[14px] rounded-lg transition-all ${
                        formData.gender === item.value ? 'bg-primary-50 text-primary-600 font-bold' : 'text-slate-700 hover:bg-primary-50 hover:text-primary-600'
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
            <label className="text-[14px] font-bold text-brand-dark">Ngày sinh</label>
            <Input
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => handleChange('date_of_birth', e.target.value)}
              className="h-11 rounded-xl px-4 text-[14.5px] border-slate-200 focus-visible:ring-primary-500/20 focus-visible:border-primary-500 shadow-sm bg-white"
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-6 mt-2">
        <h4 className="text-[15px] font-bold text-brand-dark mb-2">Thông tin liên hệ</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-brand-dark">Số điện thoại</label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="h-11 rounded-xl px-4 text-[14.5px] border-slate-200 focus-visible:ring-primary-500/20 focus-visible:border-primary-500 shadow-sm bg-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-brand-dark">Email liên hệ</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="h-11 rounded-xl px-4 text-[14.5px] border-slate-200 focus-visible:ring-primary-500/20 focus-visible:border-primary-500 shadow-sm bg-white"
            />
          </div>
        </div>

        <FormTextarea
          label="Địa chỉ liên hệ"
          value={formData.address || ''}
          onChange={(val) => handleChange('address', val)}
          placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện..."
        />
      </div>

      <div className="flex justify-end mt-2">
        <Button disabled={isLoading} type="submit" className="bg-primary-500 hover:bg-primary-600 text-white rounded-xl h-11 px-8 font-bold shadow-sm transition-all cursor-pointer">
          {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang lưu...</> : <><Save className="w-4 h-4 mr-2" /> Lưu thay đổi</>}
        </Button>
      </div>
    </form>
  );
};