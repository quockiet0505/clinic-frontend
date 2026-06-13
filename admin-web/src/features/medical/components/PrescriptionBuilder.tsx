import React, { useState } from 'react';
import { Plus, Trash2, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PrescriptionItem } from '../types/medical';

export default function PrescriptionBuilder() {
  const [items, setItems] = useState<PrescriptionItem[]>([]);
  const [med, setMed] = useState('');
  const [dosage, setDosage] = useState('');
  const [qty, setQty] = useState('');

  const handleAdd = () => {
    if (med && dosage && qty) {
      setItems([...items, { id: Date.now(), medicineId: 1, medicationName: med, dosage, quantity: Number(qty) }]);
      setMed(''); setDosage(''); setQty('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col xl:flex-row gap-4 items-end">
        <div className="w-full xl:flex-1 space-y-2">
          <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Medication</label>
          <Input value={med} onChange={(e) => setMed(e.target.value)} className="h-11 rounded-xl bg-white" placeholder="Tìm kiếm medicine..." />
        </div>
        <div className="w-full xl:flex-1 space-y-2">
          <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Dosage / Instructions</label>
          <Input value={dosage} onChange={(e) => setDosage(e.target.value)} className="h-11 rounded-xl bg-white" placeholder="e.g. 1 pill twice a day" />
        </div>
        <div className="w-full xl:w-24 space-y-2">
          <label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Qty</label>
          <Input type="number" value={qty} onChange={(e) => setQty(e.target.value)} className="h-11 rounded-xl bg-white" placeholder="0" />
        </div>
        <Button onClick={handleAdd} className="h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg text-white font-bold px-6 w-full xl:w-auto cursor-pointer">
          <Plus size={18} className="mr-2"/> Add
        </Button>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="text-center p-8 text-slate-400 font-medium border-2 border-dashed border-slate-200 rounded-2xl">
            No medications added to this prescription yet.
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><Pill size={18}/></div>
                <div>
                  <p className="font-bold text-slate-900">{item.medicationName}</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">{item.dosage} • Qty: {item.quantity}</p>
                </div>
              </div>
              <Button onClick={() => setItems(items.filter(i => i.id !== item.id))} variant="outline" size="sm" className="w-9 h-9 p-0 rounded-xl text-rose-600 border-slate-200 hover:bg-rose-50">
                <Trash2 size={16}/>
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}