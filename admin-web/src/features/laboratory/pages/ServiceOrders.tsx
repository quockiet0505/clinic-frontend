// features/laboratory/pages/ServiceOrders.tsx
import React, { useState } from 'react';
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
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const data = await laboratoryApi.getServiceOrders();
    setOrders(data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [inputOrder, setInputOrder] = useState<ServiceOrder | null>(null);
  const [rejectOrder, setRejectOrder] = useState<ServiceOrder | null>(null);

  const total = orders.length;
  const pending = orders.filter(o => o.status === 'ORDERED').length;
  const done = orders.filter(o => o.status === 'DONE').length;
  const rejected = orders.filter(o => o.status === 'REJECTED').length;

  const filtered = orders.filter(o => 
    (statusFilter === 'ALL' || o.status === statusFilter) &&
    (o.patientName || '').toLowerCase().includes(search.toLowerCase()) &&
    (!fromDate || o.createdAt >= fromDate) && (!toDate || o.createdAt <= toDate)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader 
          title="Chỉ định Xét nghiệm" 
          description="Quản lý các chỉ định xét nghiệm chờ xử lý và nhập kết quả." 
          hideActions
        />
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold">
              <FileText size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Tổng chỉ định</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{total}</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center font-bold">
              <Clock size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Chờ lấy mẫu</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{pending}</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center font-bold">
              <CheckCircle size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Đã có kết quả</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{done}</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center font-bold">
              <XCircle size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Từ chối</p>
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

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Đang tải danh sách...</div>
      ) : (
        <ServiceOrdersTable data={filtered} onInputResult={setInputOrder} onReject={setRejectOrder} />
      )}

      <ServiceOrderFormDialog 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onSubmit={(data: any) => {
          setOrders([{ ...data, orderId: Date.now(), recordId: 999, status: 'ORDERED', createdAt: TODAY }, ...orders]);
          setIsAddOpen(false);
        }} 
      />

      <LabResultInputForm 
        order={inputOrder} 
        onClose={() => setInputOrder(null)} 
        onSubmit={async (id: number, data: any) => { 
          await laboratoryApi.submitResult({ orderId: id, resultData: data.resultData, conclusion: data.conclusion, enteredById: 1 });
          await fetchOrders();
          setInputOrder(null); 
        }} 
      />
      
      <ActionReasonDialog 
        isOpen={!!rejectOrder} 
        onClose={() => setRejectOrder(null)} 
        onConfirm={async (action, reason) => { 
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