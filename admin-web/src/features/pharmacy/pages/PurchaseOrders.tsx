import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/common/PageHeader';
import ActionReasonDialog from '@/components/common/ActionReasonDialog';
import PurchaseOrderFilterBar from '../components/PurchaseOrderFilterBar';
import PurchaseOrderTable from '../components/PurchaseOrderTable';
import { PurchaseOrder } from '../types/pharmacy';
import PurchaseOrderFormDialog from '../components/PurchaseOrderFormDialog';

const TODAY = new Date().toISOString().split('T')[0];

export default function PurchaseOrders() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([
    { poId: 2026001, supplierId: 1, supplierName: 'PharmaCorp Global', orderDate: TODAY, totalAmount: 4500.00, status: 'PENDING', created_by_name: 'Admin' },
    { poId: 2026002, supplierId: 2, supplierName: 'MedSupply Co.', orderDate: TODAY, totalAmount: 1250.50, status: 'RECEIVED', created_by_name: 'Admin' }
  ]);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [fromDate, setFromDate] = useState(TODAY);
  const [toDate, setToDate] = useState(TODAY);
  const [cancelOrder, setCancelOrder] = useState<PurchaseOrder | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filtered = orders.filter(o => 
    (statusFilter === 'ALL' || o.status === statusFilter) &&
    (o.supplierName.toLowerCase().includes(search.toLowerCase()) || o.poId.toString().includes(search)) &&
    (o.orderDate >= fromDate && o.orderDate <= toDate)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <PageHeader title="Purchase Orders" description="Manage supplier orders and restock pharmacy inventory." />
        <Button 
          onClick={() => setIsFormOpen(true)}
          className="h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg text-white font-bold px-5 shadow-sm"
          >
          <Plus size={18} className="mr-2"/> Create Order
          </Button>
      </div>

      <PurchaseOrderFilterBar search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter} fromDate={fromDate} toDate={toDate} setFromDate={setFromDate} setToDate={setToDate} />

      <PurchaseOrderTable data={filtered} onMarkReceived={(id: number) => setOrders(orders.map(o => o.poId === id ? { ...o, status: 'RECEIVED' } : o))} onCancel={setCancelOrder} />

     <PurchaseOrderFormDialog 
     isOpen={isFormOpen} 
     onClose={() => setIsFormOpen(false)} 
     onSave={(data: any) => {
     setOrders([{
          poId: Date.now(),
          supplierId: 99,
          supplierName: data.supplierName,
          orderDate: TODAY,
          totalAmount: data.totalAmount,
          status: 'PENDING',
          created_by_name: 'Current User'
     }, ...orders]);

     setIsFormOpen(false);
     }} 
     />
      <ActionReasonDialog isOpen={!!cancelOrder} onClose={() => setCancelOrder(null)} onConfirm={(action, reason) => { setOrders(orders.map(o => o.poId === cancelOrder?.poId ? { ...o, status: 'CANCELLED' } : o)); setCancelOrder(null); }} title="Cancel Purchase Order" description={`Reason for cancelling PO-${cancelOrder?.poId}?`} reasonLabel="Cancellation Reason" confirmText="Cancel Order" confirmColor="rose" />
    </div>
  );
}