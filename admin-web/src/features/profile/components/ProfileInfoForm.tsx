import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ProfileInfoForm({ formData, onChange, onSave }: any) {
  return (
    <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
      <div>
        <h3 className="text-lg font-black text-slate-900">Personal Information</h3>
        <p className="text-sm font-medium text-slate-500 mt-1">Update your basic profile details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
          <Input name="full_name" value={formData.full_name} onChange={onChange} className="h-11 rounded-xl bg-slate-50 font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Gender</label>
          <select name="gender" value={formData.gender} onChange={onChange} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-600">
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Date of Birth</label>
          <Input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={onChange} className="h-11 rounded-xl bg-slate-50 font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Phone Number</label>
          <Input name="phone" value={formData.phone} onChange={onChange} className="h-11 rounded-xl bg-slate-50 font-bold" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
          <Input type="email" name="email" value={formData.email} onChange={onChange} className="h-11 rounded-xl bg-slate-50 font-bold" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Home Address</label>
          <Input name="address" value={formData.address} onChange={onChange} className="h-11 rounded-xl bg-slate-50 font-bold" />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button onClick={onSave} className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 shadow-sm">
          Save Changes
        </Button>
      </div>
    </div>
  );
}