import React from 'react';
import { Pill, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function DispenseRxDialog({ prescription, onClose, onConfirm }: any) {
  if (!prescription) return null;

  return (
    <Dialog open={!!prescription} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0 rounded-[24px] shadow-2xl">
        <div className="bg-primary-50 p-6 border-b border-primary-100 text-primary-900 rounded-t-[24px]">
          <div className="flex items-center gap-2 mb-2 text-primary-600">
            <Pill size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Nhà thuốc</span>
          </div>
          <DialogTitle className="text-2xl font-semibold">Phát thuốc</DialogTitle>
          <DialogDescription className="text-sm text-primary-600/80 font-medium">Kiểm tra các loại thuốc cho {prescription.patientName}.</DialogDescription>
        </div>
        
        <div className="p-6 bg-white space-y-3 max-h-[50vh] overflow-y-auto custom-scrollbar">
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
        
        <DialogFooter className="p-6 pb-8 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end rounded-b-[24px]">
          <Button variant="outline" onClick={onClose} className="h-11 px-6 rounded-[14px] font-bold border-slate-300 text-slate-700 hover:text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200 cursor-pointer">Hủy</Button>
          <Button onClick={() => onConfirm(prescription.prescriptionId)} className="h-11 px-6 rounded-[14px] bg-primary hover:bg-primary-600 shadow-sm text-white font-bold transition-all duration-200 cursor-pointer">
            <CheckCircle2 size={16} className="mr-2"/> Đã phát
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}