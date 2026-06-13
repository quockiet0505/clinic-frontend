import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { VitalSigns } from '../types/medical';

export default function VitalSignsForm({ initialData }: { initialData?: VitalSigns }) {
  const [vitals, setVitals] = useState<Partial<VitalSigns>>(initialData || { weight: '', bloodPressure: '', pulse: '' } as any);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="block mb-2 text-sm font-medium text-slate-700">Cân nặng (kg)</label>
        <Input type="number" value={vitals.weight || ''} onChange={(e) => setVitals({...vitals, weight: Number(e.target.value)})} className="h-11 rounded-[16px] font-medium border-slate-200" placeholder="vd: 70" />
      </div>
      <div className="space-y-2">
        <label className="block mb-2 text-sm font-medium text-slate-700">Nhịp tim (bpm)</label>
        <Input type="number" value={vitals.pulse || ''} onChange={(e) => setVitals({...vitals, pulse: Number(e.target.value)})} className="h-11 rounded-[16px] font-medium border-slate-200" placeholder="vd: 85" />
      </div>
      <div className="col-span-2 space-y-2">
        <label className="block mb-2 text-sm font-medium text-slate-700">Huyết áp (mmHg)</label>
        <Input value={vitals.bloodPressure || ''} onChange={(e) => setVitals({...vitals, bloodPressure: e.target.value})} className="h-11 rounded-[16px] font-medium border-slate-200" placeholder="vd: 120/80" />
      </div>
    </div>
  );
}