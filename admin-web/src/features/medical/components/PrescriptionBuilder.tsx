import React, { useState } from 'react';
import { Plus, Trash2, Pill, Search, ClipboardList, Package } from 'lucide-react';
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
      setItems([...items, { id: Date.now(), medicineId: 1, medicineName: med, dosage, quantity: Number(qty), unit: 'viên' }]);
      setMed(''); setDosage(''); setQty('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col xl:flex-row gap-4 items-end">
        {/* Tên thuốc */}
        <div className="w-full xl:flex-1 space-y-2">
          <label className="block text-sm font-medium text-slate-700">Tên thuốc</label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={med}
              onChange={(e) => setMed(e.target.value)}
              className="h-11 rounded-xl font-medium border-slate-200 pl-9 placeholder:text-sm"
              placeholder="Tìm kiếm thuốc..."
            />
          </div>
        </div>

        {/* Liều lượng */}
        <div className="w-full xl:flex-1 space-y-2">
          <label className="block text-sm font-medium text-slate-700">Liều lượng / Hướng dẫn</label>
          <div className="relative">
            <ClipboardList size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="h-11 rounded-xl font-medium border-slate-200 pl-9 placeholder:text-sm"
              placeholder="vd: 1 viên, 2 lần/ngày"
            />
          </div>
        </div>

        {/* Số lượng */}
        <div className="w-full xl:w-24 space-y-2">
          <label className="block text-sm font-medium text-slate-700">Số lượng</label>
          <div className="relative">
            <Package size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="h-11 rounded-xl font-medium border-slate-200 pl-9 placeholder:text-sm"
              placeholder="0"
            />
          </div>
        </div>

        <Button
          onClick={handleAdd}
          className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 w-full xl:w-auto cursor-pointer"
        >
          <Plus size={18} className="mr-1" />Thêm
        </Button>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="text-center p-8 text-slate-400 font-medium border-2 border-dashed border-slate-200 rounded-xl">
            Chưa có thuốc nào trong đơn thuốc này.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Pill size={18} />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">{item.medicineName}</div>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">{item.dosage} • SL: {item.quantity}</p>
                </div>
              </div>
              <Button
                onClick={() => setItems(items.filter((i) => i.id !== item.id))}
                variant="outline"
                size="sm"
                className="w-9 h-9 p-0 rounded-xl text-rose-600 border-slate-200 hover:bg-rose-50 hover:border-rose-200"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}