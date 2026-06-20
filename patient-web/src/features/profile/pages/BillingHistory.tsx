import React, { useState } from 'react';
import { CreditCard, Download, Receipt, Search } from 'lucide-react';
import { SectionContainer } from '@/components/common';
import { Card } from '@/components/ui/card';

export const BillingHistory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const mockInvoices = [
    {
      id: 'INV-2023-001',
      date: '2023-10-24',
      service: 'Khám chuyên khoa Tiêu hóa',
      amount: 500000,
      status: 'Đã thanh toán',
      method: 'Chuyển khoản'
    },
    {
      id: 'INV-2023-002',
      date: '2023-10-24',
      service: 'Xét nghiệm máu tổng quát',
      amount: 1200000,
      status: 'Đã thanh toán',
      method: 'Tiền mặt'
    },
    {
      id: 'INV-2023-003',
      date: '2023-11-05',
      service: 'Khám nội tiết',
      amount: 400000,
      status: 'Chưa thanh toán',
      method: '-'
    }
  ];

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
                <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-sm">Lịch Sử Thanh Toán</h1>
                <p className="text-white/90 text-sm drop-shadow-sm">Xem lại lịch sử hóa đơn và các dịch vụ đã sử dụng.</p>
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
          <div className="p-1">
            <table className="w-full text-sm text-left">
              <thead className="text-[13px] text-slate-500 uppercase bg-slate-50 rounded-t-2xl">
                <tr>
                  <th className="px-6 py-5 font-bold rounded-tl-2xl">Mã HĐ / Ngày</th>
                  <th className="px-6 py-5 font-bold">Dịch vụ</th>
                  <th className="px-6 py-5 font-bold">Tổng tiền</th>
                  <th className="px-6 py-5 font-bold">Trạng thái</th>
                  <th className="px-6 py-5 font-bold rounded-tr-2xl">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {mockInvoices.map((invoice, idx) => (
                  <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="font-bold text-slate-700">{invoice.id}</div>
                      <div className="text-slate-400 text-[13px] mt-0.5">{new Date(invoice.date).toLocaleDateString('vi-VN')}</div>
                    </td>
                    <td className="px-6 py-5 font-medium text-slate-600">{invoice.service}</td>
                    <td className="px-6 py-5">
                      <span className="font-bold text-slate-800">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(invoice.amount)}</span>
                      <div className="text-slate-400 text-[12px] mt-0.5">{invoice.method}</div>
                    </td>
                    <td className="px-6 py-5">
                      {invoice.status === 'Đã thanh toán' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-bold">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> {invoice.status}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-600 text-xs font-bold">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> {invoice.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <button className="p-2 rounded-xl text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                        <Download className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </SectionContainer>
    </main>
  );
};
