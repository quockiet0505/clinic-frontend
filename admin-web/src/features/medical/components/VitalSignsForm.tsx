import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { VitalSigns } from '../types/medical';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function VitalSignsForm({ initialData, onChange }: { initialData?: VitalSigns, onChange?: (v: Partial<VitalSigns>) => void }) {
  const [vitals, setVitals] = useState<Partial<VitalSigns>>(initialData || { weight: undefined, bloodPressure: '', pulse: undefined, height: undefined, temperature: undefined } as any);

  // Notify parent of changes
  React.useEffect(() => {
    if (onChange) {
      onChange(vitals);
    }
  }, [vitals, onChange]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="block mb-2 text-sm font-medium text-slate-700">Chiều cao (cm)</label>
        <Input type="number" value={vitals.height || ''} onChange={(e) => setVitals({...vitals, height: Number(e.target.value)})} className="h-11 rounded-[16px] font-medium border-slate-200" placeholder="vd: 170" />
      </div>
      <div className="space-y-2">
        <label className="block mb-2 text-sm font-medium text-slate-700">Cân nặng (kg)</label>
        <Input type="number" value={vitals.weight || ''} onChange={(e) => setVitals({...vitals, weight: Number(e.target.value)})} className="h-11 rounded-[16px] font-medium border-slate-200" placeholder="vd: 70" />
      </div>
      <div className="space-y-2">
        <label className="block mb-2 text-sm font-medium text-slate-700">Nhiệt độ (°C)</label>
        <Input type="number" step="0.1" value={vitals.temperature || ''} onChange={(e) => setVitals({...vitals, temperature: Number(e.target.value)})} className="h-11 rounded-[16px] font-medium border-slate-200" placeholder="vd: 37.0" />
      </div>
      <div className="space-y-2">
        <label className="block mb-2 text-sm font-medium text-slate-700">Nhịp tim (bpm)</label>
        <Input type="number" value={vitals.pulse || ''} onChange={(e) => setVitals({...vitals, pulse: Number(e.target.value)})} className="h-11 rounded-[16px] font-medium border-slate-200" placeholder="vd: 85" />
      </div>
      <div className="space-y-2">
        <label className="block mb-2 text-sm font-medium text-slate-700">Huyết áp (mmHg)</label>
        <Input value={vitals.bloodPressure || ''} onChange={(e) => setVitals({...vitals, bloodPressure: e.target.value})} className="h-11 rounded-[16px] font-medium border-slate-200" placeholder="vd: 120/80" />
      </div>
      
      <div className="col-span-2 pt-2 border-t border-slate-100 mt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Thông tin bệnh lý</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block mb-2 text-sm font-medium text-slate-700">Nhóm máu</label>
            <select
              value={vitals.bloodType || ''}
              onChange={(e) => setVitals({...vitals, bloodType: e.target.value})}
              className="w-full h-11 px-3 rounded-[16px] border border-slate-200 bg-white text-[14px] font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
            >
              <option value="">Chưa cập nhật</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block mb-2 text-sm font-medium text-slate-700">Dị ứng</label>
            <Input value={vitals.allergies || ''} onChange={(e) => setVitals({...vitals, allergies: e.target.value})} className="h-11 rounded-[16px] font-medium border-slate-200" placeholder="vd: Phấn hoa, Hải sản" />
          </div>
          <div className="col-span-2 space-y-2">
            <label className="block mb-2 text-sm font-medium text-slate-700">Bệnh mãn tính</label>
            <Input value={vitals.chronicDiseases || ''} onChange={(e) => setVitals({...vitals, chronicDiseases: e.target.value})} className="h-11 rounded-[16px] font-medium border-slate-200" placeholder="vd: Tiểu đường tuýp 2, Cao huyết áp" />
          </div>
        </div>
      </div>
    </div>
  );
}