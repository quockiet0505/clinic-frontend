import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Service } from '../types/settings';

export default function ServiceFormDialog({ service, onClose, onSave }: any) {
  const [formData, setFormData] = useState({ service_name: '', service_type: 'EXAM', price: 0 });

  useEffect(() => {
    if (service) setFormData({ 
      service_name: service.service_name || '', 
      service_type: service.service_type || 'EXAM', 
      price: service.price || 0 
    });
  }, [service]);

  if (!service) return null;

  return (
    <Dialog open={!!service} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-0 rounded-2xl shadow-2xl">
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <Activity size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Service Catalog</span>
          </div>
          <DialogTitle className="text-xl font-black">{service.service_id === 0 ? 'Add Service' : 'Edit Service'}</DialogTitle>
        </div>
        <div className="p-6 bg-slate-50 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Service Name</label>
            <Input value={formData.service_name} onChange={(e) => setFormData({...formData, service_name: e.target.value})} className="h-11 rounded-xl font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Type</label>
            <select value={formData.service_type} onChange={(e) => setFormData({...formData, service_type: e.target.value as any})} className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-bold">
              <option value="EXAM">Medical Exam</option>
              <option value="LAB_TEST">Lab Test</option>
              <option value="IMAGING">Imaging (X-Ray/Ultrasound)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Base Price ($)</label>
            <Input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} className="h-11 rounded-xl font-black text-blue-600" />
          </div>
        </div>
        <DialogFooter className="p-6 bg-white border-t border-slate-100 flex gap-3">
          <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold">Cancel</Button>
          <Button onClick={() => onSave(service.service_id, formData)} className="rounded-xl bg-blue-600 text-white font-bold px-6">Save Service</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}