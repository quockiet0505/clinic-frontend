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
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Building2 size={14}/> Clinic Name</label>
            <Input name="clinicName" value={formData.clinicName} onChange={onChange} className="h-11 rounded-xl bg-slate-50 focus:bg-white focus:ring-blue-600 font-medium border-slate-200" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><MapPin size={14}/> Full Address</label>
            <Input name="address" value={formData.address} onChange={onChange} className="h-11 rounded-xl bg-slate-50 focus:bg-white focus:ring-blue-600 font-medium border-slate-200" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Phone size={14}/> Phone Number</label>
            <Input name="phone" value={formData.phone} onChange={onChange} className="h-11 rounded-xl bg-slate-50 focus:bg-white focus:ring-blue-600 font-medium border-slate-200" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Mail size={14}/> Email Address</label>
            <Input name="email" value={formData.email} onChange={onChange} className="h-11 rounded-xl bg-slate-50 focus:bg-white focus:ring-blue-600 font-medium border-slate-200" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Globe size={14}/> Website Domain</label>
            <Input name="website" value={formData.website} onChange={onChange} className="h-11 rounded-xl bg-slate-50 focus:bg-white focus:ring-blue-600 font-medium border-slate-200" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Clock size={14}/> Operating Hours</label>
            <Input name="operatingHours" value={formData.operatingHours} onChange={onChange} className="h-11 rounded-xl bg-slate-50 focus:bg-white focus:ring-blue-600 font-medium border-slate-200" />
          </div>
        </div>

        <Button onClick={onSave} className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg text-white font-bold px-8 h-11 shadow-sm">
          <Save size={18} className="mr-2" /> Save Configuration
        </Button>
      </div>
    </div>
  );
}