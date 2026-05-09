import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import ActionReasonDialog from '@/components/common/ActionReasonDialog';
import ServiceOrdersFilterBar from '../components/ServiceOrdersFilterBar';
import ServiceOrdersTable from '../components/ServiceOrdersTable';
import LabResultInputForm from '../components/LabResultInputForm';
import ServiceOrderFormDialog from '../components/ServiceOrderFormDialog'; // Import Component Mới
import { ServiceOrder } from '../types/laboratory';

const TODAY = new Date().toISOString().split('T')[0];

export default function ServiceOrders() {
  const [orders, setOrders] = useState<ServiceOrder[]>([
    { order_id: 1, record_id: 101, service_id: 1, service_name: 'Complete Blood Count', patient_name: 'Liam Anderson', ordered_by: 1, doctor_name: 'Sarah Smith', status: 'ORDERED', created_at: TODAY },
    { order_id: 2, record_id: 102, service_id: 2, service_name: 'Lipid Panel', patient_name: 'William Garcia', ordered_by: 1, doctor_name: 'Sarah Smith', status: 'DONE', created_at: TODAY }
  ]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [fromDate, setFromDate] = useState(TODAY);
  const [toDate, setToDate] = useState(TODAY);
  
  const [isAddOpen, setIsAddOpen] = useState(false); // State mở form thêm mới
  const [inputOrder, setInputOrder] = useState<ServiceOrder | null>(null);
  const [rejectOrder, setRejectOrder] = useState<ServiceOrder | null>(null);

  const filtered = orders.filter(o => 
    (statusFilter === 'ALL' || o.status === statusFilter) &&
    o.patient_name.toLowerCase().includes(search.toLowerCase()) &&
    o.created_at >= fromDate && o.created_at <= toDate
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      {/* Sửa lại PageHeader có thêm nút Action */}
      <PageHeader 
        title="Laboratory Orders" 
        description="Manage pending lab tests and input results." 
        actionText="New Lab Order"
        onAction={() => setIsAddOpen(true)}
      />

      <ServiceOrdersFilterBar search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter} fromDate={fromDate} toDate={toDate} setFromDate={setFromDate} setToDate={setToDate} />

      <ServiceOrdersTable data={filtered} onInputResult={setInputOrder} onReject={setRejectOrder} />

      {/* FORM THÊM MỚI */}
      <ServiceOrderFormDialog 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onSubmit={(data: any) => {
          setOrders([{ ...data, order_id: Date.now(), record_id: 999, status: 'ORDERED', created_at: TODAY }, ...orders]);
          setIsAddOpen(false);
        }} 
      />

      <LabResultInputForm 
        order={inputOrder} 
        onClose={() => setInputOrder(null)} 
        onSubmit={(id: number, data: any) => { 
          setOrders(orders.map(o => o.order_id === id ? { ...o, status: 'DONE' } : o)); 
          setInputOrder(null); 
        }} 
      />
      
      <ActionReasonDialog 
        isOpen={!!rejectOrder} 
        onClose={() => setRejectOrder(null)} 
        onConfirm={(action, reason) => { 
          setOrders(orders.map(o => o.order_id === rejectOrder?.order_id ? { ...o, status: 'REJECTED' } : o)); 
          setRejectOrder(null); 
        }}
        title="Reject Lab Sample"
        description={`Reason for rejecting the sample for ${rejectOrder?.patient_name}'s test?`}
        reasonLabel="Rejection Reason (e.g. Hemolyzed)"
        confirmText="Reject Sample"
        confirmColor="rose"
      />
    </div>
  );
}