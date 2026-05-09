import React, { useState } from 'react';
import { DollarSign, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function PaymentCheckoutDialog({ invoice, onClose, onProcessPayment }: any) {
  const [method, setMethod] = useState<'CASH' | 'TRANSFER'>('CASH');

  if (!invoice) return null;

  return (
    <Dialog open={!!invoice} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-0 rounded-[32px] shadow-2xl">
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <DollarSign size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Checkout</span>
          </div>
          <DialogTitle className="text-xl font-black">Process Payment</DialogTitle>
          <DialogDescription className="text-blue-100">Collect payment for {invoice.patient_name} (Bill: #{invoice.bill_id}).</DialogDescription>
        </div>
        
        <div className="p-6 bg-slate-50 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Amount Due</p>
            <p className="text-4xl font-black text-slate-900">${invoice.total_price.toFixed(2)}</p>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setMethod('CASH')} className={`p-4 rounded-xl border-2 font-bold transition-all flex flex-col items-center gap-2 ${method === 'CASH' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}>
                CASH
              </button>
              <button onClick={() => setMethod('TRANSFER')} className={`p-4 rounded-xl border-2 font-bold transition-all flex flex-col items-center gap-2 ${method === 'TRANSFER' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}>
                TRANSFER
              </button>
            </div>
          </div>
        </div>
        
        <DialogFooter className="p-6 bg-white border-t border-slate-100 flex gap-3">
          <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold text-slate-500">Cancel</Button>
          <Button onClick={() => onProcessPayment(invoice.bill_id, method)} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 shadow-sm">
            <CheckCircle2 size={18} className="mr-2"/> Confirm Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}