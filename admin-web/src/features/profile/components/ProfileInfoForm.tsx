import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CustomSelect from '@/components/common/CustomSelect';

export default function ProfileInfoForm({ formData, onChange, onSave }: any) {
  return (
    <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
      <div>
        <h3 className="text-lg font-black text-slate-900">Thông tin Cá nhân</h3>
        <p className="text-sm font-medium text-slate-500 mt-1">Cập nhật thông tin hồ sơ cơ bản của bạn.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Họ và tên</label>
          <Input name="fullName" placeholder="Nhập họ và tên..." value={formData.fullName} onChange={onChange} className="h-11 rounded-xl bg-slate-50 font-bold" />
        </div>
        <div className="space-y-2">
          <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Giới tính</label>
          <CustomSelect name="gender" value={formData.gender} onChange={onChange} className="h-11 w-full">
            <option value="MALE">Nam</option>
            <option value="FEMALE">Nữ</option>
            <option value="OTHER">Khác</option>
          </CustomSelect>
        </div>
        <div className="space-y-2">
          <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Ngày sinh</label>
          <Input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={onChange} className="h-11 rounded-xl bg-slate-50 font-bold" />
        </div>
        <div className="space-y-2">
          <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Số điện thoại</label>
          <Input name="phone" placeholder="Nhập số điện thoại..." value={formData.phone} onChange={onChange} className="h-11 rounded-xl bg-slate-50 font-bold" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Địa chỉ Email</label>
          <Input type="email" name="email" placeholder="Ví dụ: email@domain.com" value={formData.email} onChange={onChange} className="h-11 rounded-xl bg-slate-50 font-bold" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Địa chỉ nhà</label>
          <Input name="address" placeholder="Nhập địa chỉ của bạn..." value={formData.address} onChange={onChange} className="h-11 rounded-xl bg-slate-50 font-bold" />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button onClick={onSave} className="h-11 rounded-xl bg-primary-600 hover:bg-primary-700 shadow-md hover:shadow-lg text-white font-bold px-8 shadow-sm cursor-pointer transition-all">
          Lưu Thay Đổi
        </Button>
      </div>
    </div>
  );
}