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
    { orderId: 1, recordId: 101, serviceId: 1, serviceName: 'Complete Blood Count', patientName: 'Liam Anderson', orderedBy: 1, doctorName: 'Sarah Smith', status: 'ORDERED', createdAt: TODAY },
    { orderId: 2, recordId: 102, serviceId: 2, serviceName: 'Lipid Panel', patientName: 'William Garcia', orderedBy: 1, doctorName: 'Sarah Smith', status: 'DONE', createdAt: TODAY }
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
    o.patientName.toLowerCase().includes(search.toLowerCase()) &&
    o.createdAt >= fromDate && o.createdAt <= toDate
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
          setOrders([{ ...data, orderId: Date.now(), recordId: 999, status: 'ORDERED', createdAt: TODAY }, ...orders]);
          setIsAddOpen(false);
        }} 
      />

      <LabResultInputForm 
        order={inputOrder} 
        onClose={() => setInputOrder(null)} 
        onSubmit={(id: number, data: any) => { 
          setOrders(orders.map(o => o.orderId === id ? { ...o, status: 'DONE' } : o)); 
          setInputOrder(null); 
        }} 
      />
      
      <ActionReasonDialog 
        isOpen={!!rejectOrder} 
        onClose={() => setRejectOrder(null)} 
        onConfirm={(action, reason) => { 
          setOrders(orders.map(o => o.orderId === rejectOrder?.orderId ? { ...o, status: 'REJECTED' } : o)); 
          setRejectOrder(null); 
        }}
        title="Reject Lab Sample"
        description={`Reason for rejecting the sample for ${rejectOrder?.patientName}'s test?`}
        reasonLabel="Rejection Reason (e.g. Hemolyzed)"
        confirmText="Reject Sample"
        confirmColor="rose"
      />
    </div>
  );
}