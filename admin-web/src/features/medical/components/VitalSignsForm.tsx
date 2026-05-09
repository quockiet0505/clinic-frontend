import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { VitalSigns } from '../types/medical';

export default function VitalSignsForm({ initialData }: { initialData?: VitalSigns }) {
  const [vitals, setVitals] = useState<Partial<VitalSigns>>(initialData || { weight: '', blood_pressure: '', pulse: '' } as any);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Weight (kg)</label>
        <Input type="number" value={vitals.weight || ''} onChange={(e) => setVitals({...vitals, weight: Number(e.target.value)})} className="h-11 rounded-xl bg-slate-50 font-bold" placeholder="e.g. 70" />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pulse (bpm)</label>
        <Input type="number" value={vitals.pulse || ''} onChange={(e) => setVitals({...vitals, pulse: Number(e.target.value)})} className="h-11 rounded-xl bg-slate-50 font-bold" placeholder="e.g. 85" />
      </div>
      <div className="col-span-2 space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Blood Pressure (mmHg)</label>
        <Input value={vitals.blood_pressure || ''} onChange={(e) => setVitals({...vitals, blood_pressure: e.target.value})} className="h-11 rounded-xl bg-slate-50 font-bold" placeholder="e.g. 120/80" />
      </div>
    </div>
  );
}