import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import ActionReasonDialog from '@/components/common/ActionReasonDialog';
import ServiceOrdersFilterBar from '../components/ServiceOrdersFilterBar';
import ServiceOrdersTable from '../components/ServiceOrdersTable';
import LabResultInputForm from '../components/LabResultInputFormDialog';
import ServiceOrderFormDialog from '../components/ServiceOrderFormDialog'; // Import Component Mới
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
  
  const [isAddOpen, setIsAddOpen] = useState(false); // State mở form thêm mới
  const [inputOrder, setInputOrder] = useState<ServiceOrder | null>(null);
  const [rejectOrder, setRejectOrder] = useState<ServiceOrder | null>(null);

  const filtered = orders.filter(o => 
    (statusFilter === 'ALL' || o.status === statusFilter) &&
    (o.patientName || '').toLowerCase().includes(search.toLowerCase()) &&
    (!fromDate || o.createdAt >= fromDate) && (!toDate || o.createdAt <= toDate)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      {/* Sửa lại PageHeader có thêm nút Action */}
      <PageHeader 
        title="Chỉ định Xét nghiệm" 
        description="Quản lý các chỉ định xét nghiệm chờ xử lý và nhập kết quả." 
        actionText="Tạo chỉ định mới"
        onAction={() => setIsAddOpen(true)}
      />

      <ServiceOrdersFilterBar search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter} fromDate={fromDate} toDate={toDate} setFromDate={setFromDate} setToDate={setToDate} />

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Đang tải danh sách...</div>
      ) : (
        <ServiceOrdersTable data={filtered} onInputResult={setInputOrder} onReject={setRejectOrder} />
      )}

      {/* FORM THÊM MỚI */}
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