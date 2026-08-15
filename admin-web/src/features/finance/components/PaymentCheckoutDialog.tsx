import React, { useState, useEffect } from 'react';
import { DollarSign, CheckCircle2, Loader2, QrCode } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { financeApi } from '../api/financeApi';

import toast from 'react-hot-toast';

export default function PaymentCheckoutDialog({ invoice, onClose, onProcessPayment, onPaymentSuccess, initialMethod = 'CASH' }: any) {
  const [method, setMethod] = useState<'CASH' | 'TRANSFER'>(initialMethod);

  useEffect(() => {
    if (invoice) {
      setMethod(initialMethod);
    }
  }, [invoice, initialMethod]);

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

  return (
    <Dialog open={!!invoice} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 border-0 rounded-[24px] shadow-2xl">
        {/* HEADER */}
        <div className="px-6 pt-6 pb-5 bg-white border-b border-slate-100 rounded-t-[24px]">
          <div className="flex items-start gap-4">
            <div className={`shrink-0 flex items-center justify-center w-11 h-11 rounded-2xl text-white shadow-md ${
              method === 'TRANSFER' 
                ? 'bg-gradient-to-br from-indigo-500 to-blue-500 shadow-indigo-200' 
                : 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-emerald-200'
            }`}>
              {method === 'TRANSFER' ? <QrCode size={20} /> : <DollarSign size={20} />}
            </div>
            <div className="pt-0.5">
              <DialogTitle className="text-[20px] font-bold text-slate-800 tracking-tight leading-none mb-2">
                {method === 'TRANSFER' ? 'Thanh toán Chuyển khoản' : 'Thanh toán Tiền mặt'}
              </DialogTitle>
              <DialogDescription className="text-[13px] text-slate-500 font-medium">
                Thu phí hóa đơn bệnh nhân <span className="font-bold text-slate-700">{invoice.patientName}</span> (Mã: <span className="font-bold text-slate-700">#BILL-{invoice.invoiceId}</span>).
              </DialogDescription>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-5 bg-slate-50 space-y-4">
          {/* Amount info */}
          <div className="flex items-center justify-between gap-4 px-1">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-wider text-slate-500 mb-1">Tổng tiền cần thanh toán</p>
              <p className="text-[26px] font-black text-primary-600 leading-none">{invoice.totalPrice.toLocaleString('vi-VN')} đ</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                method === 'TRANSFER' 
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-150' 
                  : 'bg-emerald-50 text-emerald-700 border-emerald-150'
              }`}>
                {method === 'TRANSFER' ? 'Chuyển khoản (VietQR)' : 'Thu tiền mặt tại quầy'}
              </span>
            </div>
          </div>

          {method === 'TRANSFER' ? (
            <div className="flex flex-col items-center gap-3 pt-2">
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
          ) : (
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 text-slate-600 text-sm font-medium leading-relaxed">
              Vui lòng nhận đủ số tiền mặt từ bệnh nhân, sau đó bấm nút <strong className="text-emerald-700">Xác nhận đã thu</strong> để cập nhật trạng thái hóa đơn sang đã thanh toán.
            </div>
          )}
        </div>
        
        <DialogFooter className="p-5 pb-7 bg-slate-50 border-t border-slate-100 flex gap-4 justify-end rounded-b-[24px]">
          <Button variant="outline" onClick={onClose} className="h-10 px-6 rounded-xl font-bold border-slate-300 text-slate-700 hover:text-red-600 hover:bg-red-50 hover:border-red-300 cursor-pointer transition-all">
            {method === 'TRANSFER' ? 'Đóng' : 'Hủy'}
          </Button>
          {method === 'CASH' && (
            <button onClick={() => onProcessPayment(invoice.invoiceId, method)} className="group inline-flex items-center justify-center h-10 px-6 rounded-xl font-bold bg-white text-emerald-600 ring-1 ring-emerald-500/40 hover:ring-0 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-emerald-400 hover:text-white hover:shadow-[0_6px_20px_-6px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
              <CheckCircle2 size={18} className="mr-2"/> Xác nhận đã thu
            </button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}