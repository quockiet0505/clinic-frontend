import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
}

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, description, confirmText = "Confirm" }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px] rounded-[32px] p-8 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={32} />
        </div>
        <DialogTitle className="text-2xl font-black text-slate-900 mb-2">{title}</DialogTitle>
        <DialogDescription className="text-slate-500 font-medium mb-6">{description}</DialogDescription>
        <div className="flex w-full gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 h-12 rounded-2xl font-bold border-slate-200 hover:bg-slate-50 cursor-pointer">Hủy</Button>
          <Button onClick={() => { onConfirm(); onClose(); }} className="flex-1 h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-lg shadow-rose-100">
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}