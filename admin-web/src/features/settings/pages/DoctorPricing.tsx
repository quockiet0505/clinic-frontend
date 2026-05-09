import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import SearchInput from '@/components/common/SearchInput';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import PricingTable from '../components/PricingTable';
import PricingFormDialog from '../components/PricingFormDialog';
import type { DoctorPricing } from '../types/settings';

export default function DoctorPricing() {
  const [search, setSearch] = useState('');
  const [prices, setPrices] = useState<DoctorPricing[]>([
    { id: 1, staff_id: 101, name: 'Dr. Sarah Smith', specialty: 'Cardiology', fee: 85.00 },
    { id: 2, staff_id: 102, name: 'Dr. Robert Davis', specialty: 'Pediatrics', fee: 60.00 },
  ]);

  const [editingPrice, setEditingPrice] = useState<DoctorPricing | null>(null);
  const [deletingPrice, setDeletingPrice] = useState<DoctorPricing | null>(null);

  const filteredData = prices.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 flex flex-col h-full animate-in fade-in duration-500">
      <PageHeader 
        title="Doctor Consultation Fees" 
        description="Override default service prices for specific medical practitioners." 
        actionText="Assign New Fee"
        onAction={() => setEditingPrice({ id: 0, staff_id: 0, name: '', specialty: '', fee: 0 })}
      />

      <div className="bg-white p-3 rounded-2xl border border-slate-200 flex shadow-sm shrink-0">
        <SearchInput 
          value={search} 
          onChange={setSearch} 
          placeholder="Search by doctor name..." 
        />
      </div>

      <PricingTable 
        doctors={filteredData} 
        onEdit={setEditingPrice} 
        onDelete={setDeletingPrice} 
      />

      {/* Form Thêm/Sửa chuẩn Blue-600 */}
      <PricingFormDialog 
        doctor={editingPrice} 
        onClose={() => setEditingPrice(null)} 
        onSave={(id: number, data: any) => {
          console.log("Saving Price Data:", id, data);
          setEditingPrice(null);
        }} 
      />

      {/* Dialog Xóa chuẩn Rose-600 từ Common */}
      <ConfirmDialog 
        isOpen={!!deletingPrice}
        title="Remove Price Override"
        description={`Are you sure you want to delete the specific fee for ${deletingPrice?.name}? The system will revert to the default service price.`}
        confirmText="Yes, Remove Fee"
        onClose={() => setDeletingPrice(null)}
        onConfirm={() => {
          setPrices(prices.filter(p => p.id !== deletingPrice?.id));
          setDeletingPrice(null);
        }}
      />
    </div>
  );
}