import React, { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PricingFormDialog({ doctor, onClose, onSave }: any) {
  const [formData, setFormData] = useState({ staff_id: '', fee: '' });

  useEffect(() => {
    if (doctor) {
      setFormData({
        staff_id: doctor.staff_id?.toString() || '',
        fee: doctor.fee?.toString() || ''
      });
    }
  }, [doctor]);

  if (!doctor) return null;

  return (
    <Dialog open={!!doctor} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-0 rounded-2xl shadow-2xl">
        {/* Header xanh chuẩn */}
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <DollarSign size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Price Management</span>
          </div>
          <DialogTitle className="text-xl font-black">
            {doctor.id === 0 ? 'Assign New Doctor Fee' : 'Update Consultation Fee'}
          </DialogTitle>
          <DialogDescription className="text-blue-100">
            {doctor.id === 0 ? 'Select a doctor and set their specific service price.' : `Adjust pricing for ${doctor.name}.`}
          </DialogDescription>
        </div>
        
        <div className="p-6 bg-slate-50 space-y-4">
          {doctor.id === 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select Doctor</label>
              <select 
                value={formData.staff_id}
                onChange={(e) => setFormData({...formData, staff_id: e.target.value})}
                className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="">Choose a staff member...</option>
                {/* Dữ liệu này sẽ map từ API Staff */}
                <option value="1">Dr. Sarah Smith</option>
                <option value="2">Dr. Robert Davis</option>
              </select>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Consultation Fee ($)</label>
            <Input 
              type="number" 
              value={formData.fee} 
              onChange={(e) => setFormData({...formData, fee: e.target.value})} 
              className="h-12 rounded-xl border-slate-200 bg-white focus:ring-blue-600 font-black text-xl text-blue-600" 
              placeholder="0.00"
            />
          </div>
        </div>
        
        <DialogFooter className="p-6 bg-white border-t border-slate-100 flex gap-3">
          <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold text-slate-500">Cancel</Button>
          <Button 
            onClick={() => onSave(doctor.id, formData)} 
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg text-white font-bold px-8 shadow-sm"
          >
            Save Pricing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}