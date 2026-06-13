import React, { useState, useEffect } from 'react';
import { Pill } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function MedicineFormDialog({ isOpen, onClose, onSubmit, initialData }: any) {
  const [form, setForm] = useState({ name: '', activeElement: '', unit: 'Tablet', sellPrice: '', min_stock_level: '10', productionUnit: '' });

  useEffect(() => {
    if (initialData) setForm({ ...initialData, sellPrice: initialData.sellPrice.toString(), min_stock_level: initialData.min_stock_level.toString() });
    else setForm({ name: '', activeElement: '', unit: 'Tablet', sellPrice: '', min_stock_level: '10', productionUnit: '' });
  }, [initialData, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0 rounded-[32px] shadow-2xl">
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <Pill size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Inventory Management</span>
          </div>
          <DialogTitle className="text-xl font-black">{initialData ? 'Update Medicine' : 'Add New Medicine'}</DialogTitle>
          <DialogDescription className="text-blue-100">Configure drug details, pricing, and stock alerts.</DialogDescription>
        </div>
        
        <div className="p-6 bg-slate-50 space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-2"><label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Medicine Name</label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="h-11 rounded-xl bg-white" /></div>
          <div className="space-y-2"><label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Active Element</label><Input value={form.activeElement} onChange={e => setForm({...form, activeElement: e.target.value})} className="h-11 rounded-xl bg-white" placeholder="e.g. Paracetamol 500mg" /></div>
          <div className="space-y-2"><label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Production Unit (Manufacturer)</label><Input value={form.productionUnit} onChange={e => setForm({...form, productionUnit: e.target.value})} className="h-11 rounded-xl bg-white" /></div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2"><label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Unit</label><Input value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} className="h-11 rounded-xl bg-white" placeholder="Tablet, Bottle..." /></div>
            <div className="space-y-2"><label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Sell Price ($)</label><Input type="number" value={form.sellPrice} onChange={e => setForm({...form, sellPrice: e.target.value})} className="h-11 rounded-xl bg-white" /></div>
            <div className="space-y-2"><label className="block mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Min Stock</label><Input type="number" value={form.min_stock_level} onChange={e => setForm({...form, min_stock_level: e.target.value})} className="h-11 rounded-xl bg-white" /></div>
          </div>
        </div>
        
        <DialogFooter className="p-6 pb-8 bg-white border-t border-slate-100 flex gap-3">
          <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold text-slate-500 cursor-pointer">Hủy</Button>
          <Button onClick={() => onSubmit(form, !!initialData)} disabled={!form.name} className="rounded-xl bg-blue-600 text-white font-bold px-8 cursor-pointer">Save Medicine</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}