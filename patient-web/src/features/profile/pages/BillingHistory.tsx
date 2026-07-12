import React, { useState, useEffect, useCallback } from 'react';
import { Receipt, Search, Clock, CheckCircle2, AlertCircle, QrCode } from 'lucide-react';
import { SectionContainer } from '@/components/common';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { billingApi, type PatientInvoice } from '../api/billingApi';
import { toast } from 'sonner';

export const BillingHistory: React.FC = () => {
  const [invoices, setInvoices] = useState<PatientInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeInvoice, setActiveInvoice] = useState<PatientInvoice | null>(null);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await billingApi.getMyInvoices();
      setInvoices(data);
    } catch (e) {
      console.error(e);
      setInvoices([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Auto poll status when dialog is open
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeInvoice && activeInvoice.status !== 'PAID') {
      interval = setInterval(async () => {
        try {
          const data = await billingApi.getMyInvoices();
          setInvoices(data);
          const current = data.find(i => i.invoiceId === activeInvoice.invoiceId);
          if (current && current.status === 'PAID') {
            setActiveInvoice(null);
            toast.success('Thanh toán thành công! Hệ thống đã nhận được tiền.');
          } else if (current) {
            setActiveInvoice(current); // update if it changed to PENDING_VERIFY
          }
        } catch (e) {
          // ignore
        }
      }, 5000); // 5 seconds polling
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeInvoice]);

  const handleRequestTransfer = async () => {
    if (!activeInvoice) return;
    try {
      await billingApi.requestTransfer(activeInvoice.invoiceId);
      setActiveInvoice(null);
      await fetchInvoices();
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'UNPAID':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'PENDING_VERIFY':
        return 'bg-orange-50 text-orange-600 border-orange-100 animate-pulse';
      case 'PAID':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'REFUNDED':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'CANCELLED':
        return 'bg-slate-50 text-slate-500 border-slate-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getStatusText = (status: string, paymentMethod?: string) => {
    switch (status) {
      case 'UNPAID': return 'Chưa thanh toán';
      case 'PENDING_VERIFY': return 'Chờ đối soát';
      case 'PAID': {
        const method = paymentMethod === 'CASH' ? 'Tiền mặt' : paymentMethod === 'TRANSFER' ? 'Chuyển khoản' : '';
        return method ? `Đã TT · ${method}` : 'Đã thanh toán';
      }
      case 'REFUNDED': return 'Đã hoàn tiền';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const term = searchQuery.toLowerCase();
    const idMatches = `BILL-${inv.invoiceId}`.toLowerCase().includes(term);
    const itemMatches = inv.items?.some(item => item.description.toLowerCase().includes(term)) ?? false;
    return idMatches || itemMatches;
  });

  return (
    <main className="min-h-screen bg-[#f0f9ff]">
      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[var(--color-banner-dark-start)] via-[var(--color-banner-dark-mid)] to-primary-500 py-10 px-4">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <SectionContainer className="max-w-4xl relative z-10">
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-white/80 mb-3">
            <span className="hover:text-white cursor-pointer transition-colors" onClick={() => window.location.href = '/'}>Trang chủ</span>
            <span className="text-white/40">/</span>
            <span className="text-white">Lịch sử thanh toán</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30 shadow-sm">
                <Receipt className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-sm">Hóa Đơn &amp; Thanh Toán</h1>
                <p className="text-white/90 text-sm drop-shadow-sm">Theo dõi hóa đơn dịch vụ khám bệnh và thực hiện thanh toán chuyển khoản.</p>
              </div>
            </div>
            <div className="relative w-full md:w-72 shrink-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm mã hóa đơn, dịch vụ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border-none bg-white text-slate-700 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-4 focus:ring-white/20 transition-all shadow-md"
              />
            </div>
          </div>
        </SectionContainer>
      </div>

      <SectionContainer className="max-w-4xl py-8">
        <Card className="rounded-3xl border-0 shadow-sm bg-white overflow-hidden">
          <div className="p-1 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[13px] text-slate-500 uppercase bg-slate-50 rounded-t-2xl border-b border-slate-200">
                <tr>
                  <th className="px-6 py-5 font-bold rounded-tl-2xl">Mã Hóa đơn</th>
                  <th className="px-6 py-5 font-bold">Chi tiết dịch vụ</th>
                  <th className="px-6 py-5 font-bold">Tổng tiền</th>
                  <th className="px-6 py-5 font-bold">Trạng thái</th>
                  <th className="px-6 py-5 font-bold rounded-tr-2xl text-right pr-6">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-20 text-slate-500 font-medium">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                        <p>Đang tải danh sách thanh toán...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-20 text-slate-500 font-medium">
                      Không có hóa đơn thanh toán nào.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice, idx) => (
                    <tr key={idx} className="border-b border-slate-200 last:border-0 even:bg-slate-100/60 hover:bg-primary-50/40 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="font-bold text-slate-700">BILL-{invoice.invoiceId}</div>
                        <div className="text-slate-400 text-[13px] mt-0.5">
                          {new Date(invoice.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          {invoice.items && invoice.items.map((item, i) => (
                            <p key={i} className="text-slate-600 font-medium text-xs">• {item.description}</p>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-black text-slate-800">
                          {invoice.totalPrice.toLocaleString('vi-VN')} đ
                        </span>
                        {invoice.paymentMethod && (
                          <div className="text-slate-400 text-[12px] mt-0.5">
                            {invoice.paymentMethod === 'CASH' ? 'Tiền mặt' : 'Chuyển khoản'}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${getStatusBadge(invoice.status)}`}>
                          {invoice.status === 'UNPAID' && <Clock size={12} />}
                          {invoice.status === 'PENDING_VERIFY' && <AlertCircle size={12} className="animate-bounce" />}
                          {invoice.status === 'PAID' && <CheckCircle2 size={12} />}
                          {getStatusText(invoice.status, invoice.paymentMethod)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right pr-6">
                        <div className="flex flex-col items-end gap-2">
                          {invoice.status === 'UNPAID' ? (
                            <Button 
                              onClick={() => setActiveInvoice(invoice)} 
                              size="sm" 
                              className="h-9 w-[140px] font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-200 text-[13px] cursor-pointer"
                            >
                              Thanh toán QR
                            </Button>
                          ) : invoice.status === 'PENDING_VERIFY' ? (
                            <span className="text-[13px] font-bold text-orange-600 h-9 flex items-center justify-center">Đang chờ duyệt...</span>
                          ) : (
                            <span className="text-[13px] font-bold text-emerald-600 h-9 flex items-center justify-center">Hoàn thành</span>
                          )}
                          
                          {invoice.recordId ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 w-[140px] text-[13px] font-bold rounded-xl border-primary-200 text-primary-700 hover:bg-primary-50 cursor-pointer"
                              onClick={() => window.location.href = `/records/detail/${invoice.recordId}`}
                            >
                              Xem bệnh án
                            </Button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </SectionContainer>

      {/* ── VietQR Modal ── */}
      {activeInvoice && (
        <Dialog open={!!activeInvoice} onOpenChange={(open) => !open && setActiveInvoice(null)}>
          <DialogContent className="sm:max-w-[440px] p-0 gap-0 border-0 rounded-[28px] shadow-2xl overflow-hidden bg-slate-50 flex flex-col">
            {/* HEADER */}
            <div className="px-6 pt-6 pb-5 bg-white border-b border-slate-100 shrink-0">
              <div className="flex items-start gap-4">
                <div className="shrink-0 flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-400 text-white shadow-[0_6px_16px_-4px_rgba(14,165,233,0.45)]">
                  <QrCode size={20} />
                </div>
                <div className="pt-0.5">
                  <DialogTitle className="text-[18px] font-black text-slate-800 tracking-tight leading-none mb-1.5">
                    Thanh toán VietQR
                  </DialogTitle>
                  <DialogDescription className="text-[13px] text-slate-500 font-medium">
                    Hóa đơn <span className="font-bold text-slate-700">#BILL-{activeInvoice.invoiceId}</span>
                  </DialogDescription>
                </div>
              </div>
            </div>
            
            {/* BODY */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col items-center flex-1 gap-4">
              <div className="w-full flex flex-col items-center justify-center gap-1.5 mb-2">
                <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Tổng tiền cần thanh toán</p>
                <p className="text-3xl font-black text-primary-600">{activeInvoice.totalPrice.toLocaleString('vi-VN')} đ</p>
              </div>

              <div className="w-full max-w-[280px] aspect-square relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm p-3">
                <img 
                  src={`https://img.vietqr.io/image/MB-0767664699-compact2.png?amount=${Math.round(activeInvoice.totalPrice)}&addInfo=BILL${activeInvoice.invoiceId}&accountName=DUONG%20QUOC%20KIET`} 
                  alt="VietQR Code" 
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <p className="text-[12px] text-center text-slate-500 font-medium leading-relaxed max-w-[320px] mt-1 bg-slate-100/50 p-3 rounded-lg border border-slate-100">
                Vui lòng không chỉnh sửa số tiền và nội dung chuyển khoản (<strong>BILL{activeInvoice.invoiceId}</strong>) để hệ thống nhận diện tự động chính xác.
              </p>
            </div>

            {/* FOOTER */}
            <div className="p-5 bg-white border-t border-slate-100 flex gap-3 justify-between items-center shrink-0">
              {activeInvoice.status === 'PENDING_VERIFY' ? (
                <div className="flex items-center gap-2 text-[13px] font-semibold text-orange-600">
                  <div className="w-4 h-4 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"></div>
                  Đang chờ xác nhận thanh toán...
                </div>
              ) : (
                <p className="text-[12px] text-slate-500">
                  Hệ thống sẽ tự động cập nhật khi nhận được thanh toán.
                </p>
              )}
              <Button variant="outline" onClick={() => setActiveInvoice(null)} className="h-10 px-6 rounded-xl font-bold border-slate-300 text-slate-700 hover:text-red-600 hover:bg-red-50 hover:border-red-300 cursor-pointer transition-all shrink-0">
                Thoát
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
};
