import React from 'react';
import { Save, Building2, MapPin, Phone, Mail, Globe, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface GeneralSettingsFormProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
}

export default function GeneralSettingsForm({ formData, onChange, onSave }: GeneralSettingsFormProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 overflow-y-auto p-8 relative">
      <div className="max-w-3xl space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Building2 size={16} className="text-blue-500" /> Tên phòng khám
            </label>
            <Input name="clinicName" value={formData.clinicName} onChange={onChange} className="h-11 rounded-xl border-slate-200 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <MapPin size={16} className="text-amber-500" /> Địa chỉ
            </label>
            <Input name="address" value={formData.address} onChange={onChange} className="h-11 rounded-xl border-slate-200 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Phone size={16} className="text-emerald-500" /> Số điện thoại
            </label>
            <Input name="phone" value={formData.phone} onChange={onChange} className="h-11 rounded-xl border-slate-200 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Mail size={16} className="text-indigo-500" /> Email
            </label>
            <Input name="email" value={formData.email} onChange={onChange} className="h-11 rounded-xl border-slate-200 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Globe size={16} className="text-purple-500" /> Website
            </label>
            <Input name="website" value={formData.website} onChange={onChange} className="h-11 rounded-xl border-slate-200 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Clock size={16} className="text-rose-500" /> Giờ hoạt động
            </label>
            <Input name="operatingHours" value={formData.operatingHours} onChange={onChange} className="h-11 rounded-xl border-slate-200 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
          </div>
        </div>

        <button
          onClick={onSave}
          className="group relative w-full sm:w-auto flex justify-center py-3.5 px-8 border border-primary-500 rounded-[14px] bg-transparent text-[15px] font-bold text-primary-600 overflow-hidden transition-all duration-300 hover:border-transparent hover:shadow-sm hover:shadow-primary-500/20 focus:outline-none focus:ring-4 focus:ring-primary-500/20 active:scale-[0.98] cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center group-hover:text-white transition-colors duration-300">
            <Save size={18} className="mr-2" /> Lưu Cấu hình
          </div>
        </button>
      </div>
    </div>
  );
}