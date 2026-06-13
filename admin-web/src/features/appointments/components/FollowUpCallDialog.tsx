import React, { useState, useEffect } from 'react';
import { PhoneCall } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function FollowUpCallDialog({ patient, onClose, onSubmit }: any) {
  const [result, setResult] = useState('');
  const [status, setStatus] = useState('COMPLETED');

  useEffect(() => {
    if (patient) {
      setResult('');
      setStatus('COMPLETED'); // Default action
    }
  }, [patient]);

  if (!patient) return null;

  return (
    <Dialog open={!!patient} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-0 rounded-[32px] shadow-2xl">
        
        {/* Consistent Blue Header */}
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <PhoneCall size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Call Log</span>
          </div>
          <DialogTitle className="text-xl font-black">Update Follow-up Status</DialogTitle>
          <DialogDescription className="text-blue-100">
            Record the outcome of the call with {patient.patient_name}.
          </DialogDescription>
        </div>
        
        <div className="p-6 bg-slate-50 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">New Status</label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)} 
              className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-bold focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer"
            >
              <option value="COMPLETED">Completed</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Result / Medical Note</label>
            <textarea 
              value={result} 
              onChange={(e) => setResult(e.target.value)} 
              className="flex w-full rounded-xl border border-slate-200 bg-white p-3 font-medium focus:ring-2 focus:ring-blue-600 outline-none resize-none h-24"
              placeholder="Type the outcome of the call..."
            />
          </div>
        </div>
        
        <DialogFooter className="p-6 bg-white border-t border-slate-100 flex gap-3">
          <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold text-slate-500">Cancel</Button>
          <Button 
            onClick={() => onSubmit(status, result)} 
            disabled={!result.trim()}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg text-white font-bold px-6 shadow-sm"
          >
            Save Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}