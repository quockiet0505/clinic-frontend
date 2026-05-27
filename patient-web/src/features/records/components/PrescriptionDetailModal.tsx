import React from 'react';
import { Pill } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Prescription } from '../types/record';

interface PrescriptionDetailModalProps {
  prescription: Prescription;
}

export const PrescriptionDetailModal: React.FC<PrescriptionDetailModalProps> = ({ prescription }) => {
  const formatPrice = (price?: number) => {
    if (!price) return '';
    return price.toLocaleString('vi-VN') + 'đ';
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-xl border-primary-500 text-primary-500 hover:bg-primary-50 font-bold h-10 px-4 transition-all"
        >
          <Pill className="w-4 h-4 mr-2" /> Xem đơn thuốc ({prescription.items.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-4xl rounded-3xl bg-white border-0 p-0 overflow-hidden shadow-xl">
        <DialogHeader className="bg-primary-50 px-6 py-4 border-b border-border-default">
          <DialogTitle className="text-xl font-black text-brand-dark flex items-center gap-2">
            <Pill className="w-5 h-5 text-primary-500" /> Chi tiết đơn thuốc
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="flex flex-col gap-4">
            {prescription.items.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-border-default bg-background-light gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-brand-dark text-[15px]">{item.medicineName}</span>
                    <span className="text-sm text-slate-500">{item.dosage}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:items-end text-sm font-medium text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 shrink-0">
                  <span>
                    Số lượng: <span className="text-brand-dark font-bold">{item.quantity} {item.unit}</span>
                  </span>
                  {formatPrice(item.price) && (
                    <span>
                      Đơn giá: <span className="text-brand-dark font-bold">{formatPrice(item.price)}</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};