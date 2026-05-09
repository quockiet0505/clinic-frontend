import React, { useState } from 'react';
import { Microscope } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function LabResultInputForm({ order, onClose, onSubmit }: any) {
  const [data, setData] = useState('');
  const [conclusion, setConclusion] = useState('');

  if (!order) return null;

  return (
    <Dialog open={!!order} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-0 rounded-[32px] shadow-2xl">
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <Microscope size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Clinical Laboratory</span>
          </div>
          <DialogTitle className="text-xl font-black">Input Lab Results</DialogTitle>
          <DialogDescription className="text-blue-100">
            Recording results for {order.patient_name} ({order.service_name}).
          </DialogDescription>
        </div>
        
        <div className="p-6 bg-slate-50 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Raw Data / Measurements</label>
            <textarea 
              value={data} onChange={(e) => setData(e.target.value)} 
              className="flex w-full rounded-2xl border border-slate-200 bg-white p-4 font-medium focus:ring-2 focus:ring-blue-600 outline-none resize-none h-32 shadow-sm"
              placeholder="e.g., WBC: 6.5, RBC: 4.8, HGB: 14.2..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Clinical Conclusion</label>
            <textarea 
              value={conclusion} onChange={(e) => setConclusion(e.target.value)} 
              className="flex w-full rounded-2xl border border-slate-200 bg-white p-4 font-medium focus:ring-2 focus:ring-blue-600 outline-none resize-none h-24 shadow-sm"
              placeholder="e.g., All parameters within normal limits."
            />
          </div>
        </div>
        
        <DialogFooter className="p-6 bg-white border-t border-slate-100 flex gap-3">
          <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold text-slate-500">Cancel</Button>
          <Button 
            onClick={() => onSubmit(order.order_id, { result_data: data, conclusion })} 
            disabled={!data || !conclusion}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 shadow-sm"
          >
            Publish Results
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}