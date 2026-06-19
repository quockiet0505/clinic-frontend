// features/laboratory/pages/ServiceOrders.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import ActionReasonDialog from '@/components/common/ActionReasonDialog';
import { ServiceOrdersFilterBar } from '../components/ServiceOrdersFilterBar';
import ServiceOrdersTable from '../components/ServiceOrdersTable';
import LabResultInputForm from '../components/LabResultInputFormDialog';
import ServiceOrderFormDialog from '../components/ServiceOrderFormDialog';
import GradientButton from '@/components/common/GradientButton';
import { ServiceOrder } from '../types/laboratory';
import { laboratoryApi } from '../api/laboratoryApi';

const TODAY = new Date().toISOString().split('T')[0];

export default function ServiceOrders() {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [inputOrder, setInputOrder] = useState<ServiceOrder | null>(null);
  const [rejectOrder, setRejectOrder] = useState<ServiceOrder | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await laboratoryApi.getServiceOrdersPaged({
        search: search || undefined,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        page: currentPage - 1,
        size: pageSize,
        sortBy: 'createdAt',
        sortDir: 'DESC',
      });
      setOrders(res.content);
      setTotalElements(res.totalElements);
    } catch {
      setOrders([]);
      setTotalElements(0);
    }
    setLoading(false);
  }, [search, statusFilter, fromDate, toDate, currentPage]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, fromDate, toDate]);

  const pending = orders.filter((o) => o.status === 'ORDERED').length;
  const done = orders.filter((o) => o.status === 'DONE').length;
  const rejected = orders.filter((o) => o.status === 'REJECTED').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader title="Chỉ định Xét nghiệm" description="Quản lý các chỉ định xét nghiệm chờ xử lý và nhập kết quả." />
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold"><FileText size={16} /></div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Tổng chỉ định</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{totalElements}</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center font-bold"><Clock size={16} /></div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Chờ lấy mẫu </p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{pending}</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center font-bold"><CheckCircle size={16} /></div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Đã có kết quả </p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{done}</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center font-bold"><XCircle size={16} /></div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Từ chối </p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{rejected}</p>
            </div>
          </div>
          <GradientButton onClick={() => setIsAddOpen(true)} className="shrink-0">
            <Plus size={18} className="mr-2" /> Tạo chỉ định mới
          </GradientButton>
        </div>
      </div>

      <ServiceOrdersFilterBar
        search={search}
        onSearchChange={setSearch}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
      />

      <div className="flex-1 min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <ServiceOrdersTable
          data={orders}
          loading={loading}
          onInputResult={setInputOrder}
          onReject={setRejectOrder}
          pagination={{ page: currentPage, size: pageSize, total: totalElements, onPageChange: setCurrentPage }}
        />
      </div>

      <ServiceOrderFormDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={() => {
          fetchOrders();
          setIsAddOpen(false);
        }}
      />

      <LabResultInputForm
        order={inputOrder}
        onClose={() => setInputOrder(null)}
        onSubmit={async (id: number, data: { resultData: string; conclusion: string }) => {
          await laboratoryApi.submitResult({ orderId: id, resultData: data.resultData, conclusion: data.conclusion, enteredById: 1 });
          await fetchOrders();
          setInputOrder(null);
        }}
      />

      <ActionReasonDialog
        isOpen={!!rejectOrder}
        onClose={() => setRejectOrder(null)}
        onConfirm={async (_action, reason) => {
          await laboratoryApi.updateOrderStatus(rejectOrder!.orderId, 'REJECTED', reason);
          await fetchOrders();
          setRejectOrder(null);
        }}
        title="Từ chối mẫu xét nghiệm"
        description={`Lý do từ chối mẫu xét nghiệm của bệnh nhân ${rejectOrder?.patientName}?`}
        reasonLabel="Lý do từ chối (vd: Mẫu bị hỏng)"
        confirmText="Từ chối mẫu"
        confirmColor="rose"
      />
    </div>
  );
}
