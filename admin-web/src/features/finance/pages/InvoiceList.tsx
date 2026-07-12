import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, DollarSign, Filter, Printer, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FilterBar, FilterOption, TabOption } from '@/components/common/FilterBar';
import PageHeader from '@/components/common/PageHeader';

import PaymentCheckoutDialog from '../components/PaymentCheckoutDialog';
import { BillInvoice, BillStatus } from '../types/finance';
import { financeApi } from '../api/financeApi';
import { PayButton, VerifyButton, RejectButton, ViewButton } from '@/components/common/ActionButtons';

const getStatusBadge = (status: BillStatus) => {
  switch (status) {
    case 'UNPAID': 
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'PENDING_VERIFY': 
      return 'bg-orange-100 text-orange-700 border-orange-200 animate-pulse';
    case 'PAID': 
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'REFUNDED': 
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'CANCELLED': 
      return 'bg-slate-100 text-slate-500 border-slate-200';
    default: 
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

const getStatusText = (status: BillStatus, paymentMethod?: string) => {
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

export default function InvoiceList() {
  const [invoices, setInvoices] = useState<BillInvoice[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<'ALL' | 'TODAY'>('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<BillInvoice | null>(null);
  
  const navigate = useNavigate();

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await financeApi.getInvoices({
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        search: searchTerm || undefined,
        page: currentPage - 1,
        size: pageSize
      });
      setInvoices(res.content);
      setTotalElements(res.totalElements);
    } catch (e) {
      console.error(e);
      setInvoices([]);
      setTotalElements(0);
    }
    setLoading(false);
  }, [statusFilter, searchTerm, currentPage]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter, fromDate, toDate]);

  const handleProcessPayment = async (invoiceId: number, paymentMethod: 'CASH' | 'TRANSFER') => {
    try {
      await financeApi.collectPayment(invoiceId, paymentMethod);
      setSelectedInvoice(null);
      await fetchInvoices();
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerifyPayment = async (invoiceId: number, status: 'PAID' | 'UNPAID') => {
    try {
      await financeApi.verifyTransfer(invoiceId, status);
      await fetchInvoices();
    } catch (e) {
      console.error(e);
    }
  };

  const totalRevenue = invoices
    .filter(inv => inv.status === 'PAID')
    .reduce((sum, inv) => sum + inv.totalPrice, 0);

  const todaysRevenue = invoices
    .filter(inv => inv.status === 'PAID' && new Date(inv.createdAt).toDateString() === new Date().toDateString())
    .reduce((sum, inv) => sum + inv.totalPrice, 0);

  const displayedInvoices = invoices.filter(inv => {
    const invDate = new Date(inv.createdAt);
    invDate.setHours(0, 0, 0, 0);

    if (dateFilter === 'TODAY') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return invDate.getTime() === today.getTime();
    }
    
    if (fromDate) {
      const from = new Date(fromDate);
      from.setHours(0, 0, 0, 0);
      if (invDate < from) return false;
    }
    if (toDate) {
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      if (invDate > to) return false;
    }
    return true;
  });

  const statusOptions: FilterOption[] = [
    { value: 'ALL', label: 'Tất cả trạng thái' },
    { value: 'UNPAID', label: 'Chưa thanh toán' },
    { value: 'PENDING_VERIFY', label: 'Chờ đối soát' },
    { value: 'PAID', label: 'Đã thanh toán' },
    { value: 'CANCELLED', label: 'Đã hủy' },
    { value: 'REFUNDED', label: 'Đã hoàn tiền' },
  ];

  const tabs: TabOption[] = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'TODAY', label: 'Hôm nay' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <PageHeader title="Hóa đơn & Thanh toán" description="Quản lý hóa đơn đóng băng giá và đối soát chuyển khoản cho bệnh nhân." />
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold">
              <DollarSign size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Doanh thu tổng</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{totalRevenue.toLocaleString('vi-VN')} đ</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center font-bold">
              <DollarSign size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Doanh thu hôm nay</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{todaysRevenue.toLocaleString('vi-VN')} đ</p>
            </div>
          </div>
        </div>
      </div>

      <FilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm mã hóa đơn..."
        tabs={{
          options: tabs,
          value: dateFilter,
          onChange: (val) => setDateFilter(val as any),
        }}
        filters={[
          {
            key: 'status',
            label: 'Trạng thái',
            options: statusOptions,
            value: statusFilter,
            onChange: setStatusFilter,
            placeholder: 'Trạng thái',
          },
        ]}
        advancedFilters={{
          dateRange: {
            from: fromDate,
            to: toDate,
            onFromChange: setFromDate,
            onToChange: setToDate,
          },
        }}
      />

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <Table>
            <TableHeader className="bg-slate-50 sticky top-0 z-10">
              <TableRow className="h-14">
                <TableHead className="font-bold text-slate-600 uppercase text-[11px] px-8">Hóa đơn</TableHead>
                <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Bệnh nhân</TableHead>
                <TableHead className="font-bold text-slate-600 uppercase text-[11px]">Tổng tiền</TableHead>
                <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-center">Trạng thái</TableHead>
                <TableHead className="font-bold text-slate-600 uppercase text-[11px] text-right pr-8">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                      <p className="text-slate-500 text-sm font-medium">Đang tải danh sách hóa đơn...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : displayedInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 text-slate-500 font-medium">
                    Không tìm thấy hóa đơn nào phù hợp.
                  </TableCell>
                </TableRow>
              ) : displayedInvoices.map((inv) => (
                <TableRow key={inv.invoiceId} className="hover:bg-slate-50/50">
                  <TableCell className="px-8 py-4">
                    <p className="font-bold text-slate-900">BILL-{inv.invoiceId}</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {new Date(inv.createdAt).toLocaleDateString('vi-VN')} {new Date(inv.createdAt).toLocaleTimeString('vi-VN')}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-bold text-slate-700">{inv.patientName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{inv.patientPhone}</p>
                    </div>
                  </TableCell>
                  <TableCell><span className="font-black text-slate-900">{inv.totalPrice.toLocaleString('vi-VN')} đ</span></TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={`font-bold border px-2.5 py-1 rounded-lg ${getStatusBadge(inv.status)}`}>
                      {inv.status === 'UNPAID' && <Clock size={12} className="mr-1.5 inline" />}
                      {inv.status === 'PENDING_VERIFY' && <AlertCircle size={12} className="mr-1.5 inline animate-bounce" />}
                      {inv.status === 'PAID' && <CheckCircle2 size={12} className="mr-1.5 inline" />}
                      {getStatusText(inv.status, inv.paymentMethod)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex items-center justify-end gap-2">
                      {inv.status === 'UNPAID' && (
                        <PayButton onClick={() => setSelectedInvoice(inv)} />
                      )}
                      
                      {inv.status === 'PENDING_VERIFY' && (
                        <>
                          <VerifyButton onClick={() => handleVerifyPayment(inv.invoiceId, 'PAID')} />
                          <RejectButton onClick={() => handleVerifyPayment(inv.invoiceId, 'UNPAID')} />
                        </>
                      )}

                      <ViewButton onClick={() => navigate(`/finance/invoices/${inv.invoiceId}`)} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalElements > pageSize && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
            <span className="text-xs font-semibold text-slate-500">
              Hiển thị {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalElements)} của {totalElements} hóa đơn
            </span>
            <div className="flex gap-2">
              <Button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} variant="outline" size="sm" className="h-8 rounded-lg font-bold">Trước</Button>
              <Button disabled={currentPage * pageSize >= totalElements} onClick={() => setCurrentPage(p => p + 1)} variant="outline" size="sm" className="h-8 rounded-lg font-bold">Sau</Button>
            </div>
          </div>
        )}
      </div>

      <PaymentCheckoutDialog 
        invoice={selectedInvoice} 
        onClose={() => setSelectedInvoice(null)} 
        onProcessPayment={handleProcessPayment} 
        onPaymentSuccess={() => { setSelectedInvoice(null); fetchInvoices(); }}
      />
    </div>
  );
}