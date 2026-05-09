import React from 'react';
import { Pill, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function DispenseRxDialog({ prescription, onClose, onConfirm }: any) {
  if (!prescription) return null;

  return (
    <Dialog open={!!prescription} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0 rounded-[32px] shadow-2xl">
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <Pill size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Dispensary</span>
          </div>
          <DialogTitle className="text-xl font-black">Dispense Medications</DialogTitle>
          <DialogDescription className="text-blue-100">Review items for {prescription.patient_name}.</DialogDescription>
        </div>
        
        <div className="p-6 bg-slate-50 space-y-3 max-h-[50vh] overflow-y-auto custom-scrollbar">
          {prescription.items.map((item: any, idx: number) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">{item.name}</p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">{item.dosage}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-blue-600">x{item.qty}</p>
              </div>
            </div>
          ))}
        </div>
        
        <DialogFooter className="p-6 bg-white border-t border-slate-100 flex gap-3">
          <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold text-slate-500">Cancel</Button>
          <Button onClick={() => onConfirm(prescription.prescription_id)} className="rounded-xl bg-blue-600 text-white font-bold px-8 shadow-sm">
            <CheckCircle2 size={16} className="mr-2"/> Mark Dispensed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}