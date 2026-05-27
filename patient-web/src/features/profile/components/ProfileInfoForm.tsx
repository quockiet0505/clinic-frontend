/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { profileApi } from '../api/profileApi';
import type { PatientProfile, UpdateProfilePayload } from '../types/profile';

interface ProfileInfoFormProps {
  initialData: PatientProfile;
  onSuccess: () => void;
}

export const ProfileInfoForm: React.FC<ProfileInfoFormProps> = ({ initialData, onSuccess }) => {
  const [formData, setFormData] = useState<UpdateProfilePayload>({
    full_name: initialData.full_name,
    phone: initialData.phone || '',
    gender: initialData.gender || '',
    date_of_birth: initialData.date_of_birth || '',
    address: initialData.address || '',
  });

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
      const res = await profileApi.updateMyProfile(formData);
      setMessage({ type: 'success', text: res.message });
      onSuccess();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Cập nhật thất bại' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {message.text && (
        <div
          className={`p-4 rounded-xl text-[14px] font-medium border ${
            message.type === 'success'
              ? 'bg-green-50 text-green-600 border-green-100'
              : 'bg-red-50 text-red-600 border-red-100'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-bold text-brand-dark">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <Input
            required
            value={formData.full_name}
            onChange={(e) => handleChange('full_name', e.target.value)}
            className="h-12 rounded-2xl px-4 text-[14.5px] border-border-default focus-visible:ring-primary-500/20 focus-visible:border-primary-500 shadow-none bg-white"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-bold text-brand-dark">Số điện thoại</label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="h-12 rounded-2xl px-4 text-[14.5px] border-border-default focus-visible:ring-primary-500/20 focus-visible:border-primary-500 shadow-none bg-white"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-bold text-brand-dark">Giới tính</label>
          <Select value={formData.gender} onValueChange={(val) => handleChange('gender', val)}>
            <SelectTrigger className="h-12 rounded-2xl px-4 text-[14.5px] text-slate-700 border-border-default focus-visible:ring-primary-500/20 focus-visible:border-primary-500 shadow-none bg-white w-full text-left">
              <SelectValue placeholder="Chọn giới tính" />
            </SelectTrigger>
            <SelectContent className="min-w-[var(--radix-select-trigger-width)] !border-0 border-none shadow-xl rounded-2xl bg-white p-1 outline-none ring-0 z-50">
              <SelectItem value="MALE" className="cursor-pointer py-2.5 px-3 text-slate-700 rounded-xl transition-all data-[highlighted]:bg-primary-50 data-[highlighted]:text-primary-500">
                Nam
              </SelectItem>
              <SelectItem value="FEMALE" className="cursor-pointer py-2.5 px-3 text-slate-700 rounded-xl transition-all data-[highlighted]:bg-primary-50 data-[highlighted]:text-primary-500">
                Nữ
              </SelectItem>
              <SelectItem value="OTHER" className="cursor-pointer py-2.5 px-3 text-slate-700 rounded-xl transition-all data-[highlighted]:bg-primary-50 data-[highlighted]:text-primary-500">
                Khác
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-bold text-brand-dark">Ngày sinh</label>
          <Input
            type="date"
            value={formData.date_of_birth}
            onChange={(e) => handleChange('date_of_birth', e.target.value)}
            className="h-12 rounded-2xl px-4 text-[14.5px] border-border-default focus-visible:ring-primary-500/20 focus-visible:border-primary-500 shadow-none bg-white"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-bold text-brand-dark">Địa chỉ liên hệ</label>
        <Input
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện..."
          className="h-12 rounded-2xl px-4 text-[14.5px] border-border-default focus-visible:ring-primary-500/20 focus-visible:border-primary-500 shadow-none bg-white"
        />
      </div>

      <div className="flex justify-end mt-2">
        <Button
          disabled={isLoading}
          type="submit"
          className="bg-primary-500 hover:bg-primary-600 text-white rounded-xl h-12 px-8 font-bold shadow-md transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang lưu...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" /> Lưu thay đổi
            </>
          )}
        </Button>
      </div>
    </form>
  );
};