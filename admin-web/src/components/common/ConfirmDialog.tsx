import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, description, confirmText = "Xác nhận" }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-0 rounded-[24px] shadow-2xl">
        <div className="bg-amber-50 p-6 border-b border-amber-200 rounded-t-[24px]">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-amber-700" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">Xác nhận</span>
          </div>
          <DialogTitle className="text-2xl font-semibold text-slate-800">{title}</DialogTitle>
          <DialogDescription className="text-sm text-slate-700 font-medium mt-1">
            {description}
          </DialogDescription>
        </div>
        <DialogFooter className="p-6 pb-8 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end rounded-b-[24px]">
          <Button variant="outline" onClick={onClose} className="h-11 px-6 rounded-[14px] font-bold border-slate-300 text-slate-700 hover:text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200 cursor-pointer">
            Hủy
          </Button>
          <Button onClick={() => { onConfirm(); onClose(); }} className="h-11 px-6 rounded-[14px] bg-red-600 hover:bg-red-700 shadow-sm text-white font-bold transition-all duration-200 cursor-pointer">
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}