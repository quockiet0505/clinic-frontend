import React, { useState, useEffect } from 'react';
import { DollarSign, CheckCircle2, QrCode, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { financeApi } from '../api/financeApi';

import toast from 'react-hot-toast';

export default function PaymentCheckoutDialog({ invoice, onClose, onProcessPayment, onPaymentSuccess }: any) {
  const [method, setMethod] = useState<'CASH' | 'TRANSFER'>('CASH');

  useEffect(() => {
    if (!invoice || method !== 'TRANSFER') return;

    const interval = setInterval(async () => {
      try {
        const updatedInvoice = await financeApi.getInvoiceById(invoice.invoiceId);
        if (updatedInvoice.status === 'PAID') {
          clearInterval(interval);
          toast.success('Nhận thanh toán chuyển khoản thành công!');
          onPaymentSuccess?.();
        }
      } catch (e) {
        // ignore polling errors
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [invoice, method, onPaymentSuccess]);

  if (!invoice) return null;

  const qrUrl = `https://img.vietqr.io/image/MB-0767664699-compact2.png?amount=${Math.round(invoice.totalPrice)}&addInfo=BILL${invoice.invoiceId}&accountName=DUONG%20QUOC%20KIET`;

  const handleMethodChange = (m: 'CASH' | 'TRANSFER') => {
    setMethod(m);
  };

  return (
    <Dialog open={!!invoice} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 border-0 rounded-[24px] shadow-2xl">
        {/* HEADER - Consistent with FormDialog */}
        <div className="px-6 pt-6 pb-5 bg-white border-b border-slate-100 rounded-t-[24px]">
          <div className="flex items-start gap-4">
            <div className="shrink-0 flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-400 text-white shadow-[0_6px_16px_-4px_rgba(14,165,233,0.45)]">
              <DollarSign size={20} />
            </div>
            <div className="pt-0.5">
              <DialogTitle className="text-[20px] font-bold text-slate-800 tracking-tight leading-none mb-2">
                Xử lý Thanh toán
              </DialogTitle>
              <DialogDescription className="text-[13px] text-slate-500 font-medium">
                Thu phí hóa đơn bệnh nhân <span className="font-bold text-slate-700">{invoice.patientName}</span> (Mã: <span className="font-bold text-slate-700">#BILL-{invoice.invoiceId}</span>).
              </DialogDescription>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-5 bg-slate-50 space-y-4">
          {/* Amount + method in one compact row */}
          <div className="flex items-center justify-between gap-4 px-1">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-wider text-slate-500 mb-1">Tổng tiền cần thanh toán</p>
              <p className="text-[24px] font-black text-primary-600 leading-none">{invoice.totalPrice.toLocaleString('vi-VN')} đ</p>
            </div>
            <div className="flex gap-1.5 bg-slate-200/60 p-1 rounded-xl">
              <button
                onClick={() => handleMethodChange('CASH')}
                className={`cursor-pointer px-3 py-1.5 rounded-lg border-2 font-bold text-[13px] transition-all ${
                  method === 'CASH'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                }`}
              >
                Tiền mặt
              </button>
              <button
                onClick={() => handleMethodChange('TRANSFER')}
                className={`cursor-pointer px-3 py-1.5 rounded-lg border-2 font-bold text-[13px] transition-all ${
                  method === 'TRANSFER'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                }`}
              >
                Chuyển khoản
              </button>
            </div>
          </div>

          {method === 'TRANSFER' && (
            <div className="flex flex-col items-center gap-3">
              <div className="w-full max-w-[280px] aspect-square relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm p-3">
                <img src={`https://img.vietqr.io/image/MB-0767664699-compact2.png?amount=${Math.round(invoice.totalPrice)}&addInfo=BILL${invoice.invoiceId}&accountName=DUONG%20QUOC%20KIET`} alt="VietQR Code" className="w-full h-full object-contain rounded-xl" />
              </div>
              <p className="text-[12px] text-center text-slate-500 font-medium leading-relaxed max-w-[320px] bg-slate-100/50 p-3 rounded-lg border border-slate-100">
                Nội dung chuyển khoản <strong>BILL{invoice.invoiceId}</strong> đã được thiết lập sẵn.
              </p>
              <div className="flex items-center justify-center gap-1.5 text-[12px] font-semibold text-amber-700 bg-amber-50 px-4 py-2 rounded-xl w-full max-w-[320px]">
                <Loader2 size={13} className="animate-spin" />
                Hệ thống sẽ tự xác nhận khi nhận được thanh toán
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="p-5 pb-7 bg-slate-50 border-t border-slate-100 flex gap-4 justify-end rounded-b-[24px]">
          <Button variant="outline" onClick={onClose} className="h-10 px-6 rounded-xl font-bold border-slate-300 text-slate-700 hover:text-red-600 hover:bg-red-50 hover:border-red-300 cursor-pointer transition-all">
            {method === 'TRANSFER' ? 'Đóng' : 'Hủy'}
          </Button>
          {method === 'CASH' && (
            <button onClick={() => onProcessPayment(invoice.invoiceId, method)} className="group inline-flex items-center justify-center h-10 px-6 rounded-xl font-bold bg-white text-primary-600 ring-1 ring-primary-500/40 hover:ring-0 hover:bg-gradient-to-r hover:from-primary-600 hover:to-primary-400 hover:text-white hover:shadow-[0_6px_20px_-6px_rgba(14,165,233,0.5)] hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
              <CheckCircle2 size={18} className="mr-2"/> Xác nhận
            </button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}