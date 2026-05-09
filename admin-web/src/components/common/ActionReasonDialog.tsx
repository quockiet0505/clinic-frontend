import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';

interface Option { label: string; value: string; }

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (actorValue: string, reason: string) => void;
  title: string;
  description: string;
  actorLabel?: string;
  actorOptions?: Option[];
  reasonLabel?: string;
  confirmText?: string;
  confirmColor?: 'rose' | 'amber' | 'blue';
}

export default function ActionReasonDialog({ 
  isOpen, onClose, onConfirm, title, description, 
  actorLabel, actorOptions, reasonLabel = "Reason", confirmText = "Confirm", confirmColor = "rose"
}: Props) {
  const [actorValue, setActorValue] = useState(actorOptions ? actorOptions[0].value : '');
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    onConfirm(actorValue, reason);
    setReason('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px] rounded-[32px] p-8">
        <div className="flex flex-col space-y-4">
          <div className={`flex items-center gap-3 text-${confirmColor}-600 mb-2`}>
            <div className={`w-12 h-12 bg-${confirmColor}-100 rounded-full flex items-center justify-center`}><AlertCircle size={24} /></div>
            <DialogTitle className="text-2xl font-black text-slate-900">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-slate-500 font-medium">{description}</DialogDescription>
          <div className="space-y-4 mt-2">
            {actorOptions && actorOptions.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{actorLabel}</label>
                <select value={actorValue} onChange={(e) => setActorValue(e.target.value)} className={`flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-bold focus:ring-2 focus:ring-${confirmColor}-500 focus:outline-none`}>
                  {actorOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{reasonLabel}</label>
              <Input placeholder="Type details here..." value={reason} onChange={(e) => setReason(e.target.value)} className="rounded-xl h-11" />
            </div>
          </div>
          <div className="flex w-full gap-3 mt-6">
            <Button variant="outline" onClick={onClose} className="flex-1 h-12 rounded-2xl font-bold border-slate-200">Cancel</Button>
            <Button onClick={handleConfirm} className={`flex-1 h-12 rounded-2xl bg-${confirmColor}-600 hover:bg-${confirmColor}-700 text-white font-bold shadow-lg shadow-${confirmColor}-100`}>
              {confirmText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}