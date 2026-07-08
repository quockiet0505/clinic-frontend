import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Pill, ClipboardList, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PrescriptionItem } from '../types/medical';
import { medicalApi } from '../api/medicalApi';
import { pharmacyApi } from '@/features/pharmacy/api/pharmacyApi';
import CreatableSelect from 'react-select/creatable';
import toast from 'react-hot-toast';

export default function PrescriptionBuilder({ recordId }: { recordId: number }) {
  const [items, setItems] = useState<PrescriptionItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Medicine options state
  const [options, setOptions] = useState<{ value: number | null, label: string }[]>([]);
  
  // Selected medicine state
  const [selectedMed, setSelectedMed] = useState<{ value: number | null, label: string } | null>(null);
  const [dosage, setDosage] = useState('');
  const [qty, setQty] = useState('');

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const data = await pharmacyApi.getMedicines();
        setOptions(data.map(m => ({ value: m.medicineId, label: m.name })));
      } catch (e) {
        console.error('Failed to load medicines', e);
      }
    };
    fetchMedicines();
  }, []);

  const handleAdd = () => {
    if (selectedMed && dosage.trim() && qty && Number(qty) > 0) {
      setItems([...items, { 
        id: Date.now(), 
        medicineId: selectedMed.value, 
        medicineName: selectedMed.label, 
        dosage: dosage.trim(), 
        quantity: Number(qty), 
        unit: 'viên' 
      }]);
      setSelectedMed(null); setDosage(''); setQty('');
    }
  };

  const handleSave = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      await medicalApi.createPrescription({
        recordId,
        items: items.map(i => ({
          medicineId: i.medicineId,
          medicineName: i.medicineName,
          unit: i.unit,
          quantity: i.quantity,
          dosage: i.dosage
        }))
      });
      setItems([]);
    } catch (e: any) {
      if (e.response?.data?.message) {
        toast.error(e.response.data.message, { duration: 8000 });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col xl:flex-row gap-4 items-end">
        {/* Tên thuốc */}
        <div className="w-full xl:flex-1 space-y-2">
          <label className="block text-sm font-medium text-slate-700">Tên thuốc <span className="text-red-500">*</span></label>
          <CreatableSelect
            isClearable
            options={options}
            value={selectedMed}
            onChange={(val) => setSelectedMed(val)}
            placeholder="Tìm thuốc hoặc gõ tên thuốc ngoài..."
            formatCreateLabel={(inputValue) => `Thêm thuốc ngoài: "${inputValue}"`}
            styles={{
              control: (base) => ({
                ...base,
                minHeight: '44px',
                borderRadius: '0.75rem',
                borderColor: '#e2e8f0',
                boxShadow: 'none',
                '&:hover': {
                  borderColor: '#cbd5e1',
                },
              }),
            }}
          />
        </div>

        {/* Liều lượng */}
        <div className="w-full xl:flex-1 space-y-2">
          <label className="block text-sm font-medium text-slate-700">Liều lượng / Hướng dẫn <span className="text-red-500">*</span></label>
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
          <label className="block text-sm font-medium text-slate-700">Số lượng <span className="text-red-500">*</span></label>
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
          disabled={!selectedMed || !dosage.trim() || !qty || Number(qty) <= 0}
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
                  <div className="font-semibold text-slate-800">
                    {item.medicineName}
                    {item.medicineId === null && (
                      <span className="ml-2 inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">Thuốc ngoài</span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">{item.dosage} • SL: {item.quantity}</p>
                </div>
              </div>
              <Button
                onClick={() => setItems(items.filter((i) => i.id !== item.id))}
                variant="outline"
                size="sm"
                className="w-9 h-9 p-0 rounded-xl text-rose-600 border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 cursor-pointer"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-200">
        <Button 
          onClick={handleSave} 
          disabled={items.length === 0 || loading} 
          className="bg-blue-600 hover:bg-blue-700 text-white min-w-[150px] cursor-pointer"
        >
          {loading ? 'Đang lưu...' : 'Lưu Đơn Thuốc'}
        </Button>
      </div>
    </div>
  );
}