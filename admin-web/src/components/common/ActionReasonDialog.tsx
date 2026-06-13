import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import CustomSelect from '@/components/common/CustomSelect';

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
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-0 rounded-[24px] shadow-2xl">
        <div className="bg-primary-50 p-6 border-b border-primary-100 text-primary-900 rounded-t-[24px]">
          <div className="flex items-center gap-2 mb-2 text-primary-600">
            <AlertCircle size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Xác nhận</span>
          </div>
          <DialogTitle className="text-2xl font-semibold">{title}</DialogTitle>
          <DialogDescription className="text-sm text-primary-600/80 font-medium">{description}</DialogDescription>
        </div>
        <div className="p-6 bg-white space-y-4">
            {actorOptions && actorOptions.length > 0 && (
              <div className="space-y-2">
                <label className="block mb-2 text-sm font-medium text-slate-700">{actorLabel}</label>
                <CustomSelect value={actorValue} onChange={(e: any) => setActorValue(e.target.value)} className="h-11 w-full">
                  {actorOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </CustomSelect>
              </div>
            )}
            <div className="space-y-2">
              <label className="block mb-2 text-sm font-medium text-slate-700">{reasonLabel}</label>
              <Input placeholder="Nhập chi tiết..." value={reason} onChange={(e) => setReason(e.target.value)} className="h-11 rounded-[16px] font-medium border-slate-200" />
            </div>
        </div>
        <DialogFooter className="p-6 pb-8 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end rounded-b-[24px]">
            <Button variant="outline" onClick={onClose} className="h-11 px-6 rounded-[14px] font-bold border-slate-300 text-slate-700 hover:text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200 cursor-pointer">Hủy</Button>
            <Button onClick={handleConfirm} className={`h-11 px-6 rounded-[14px] ${confirmColor === 'rose' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary-600'} shadow-sm text-white font-bold transition-all duration-200 cursor-pointer`}>
              {confirmText}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}