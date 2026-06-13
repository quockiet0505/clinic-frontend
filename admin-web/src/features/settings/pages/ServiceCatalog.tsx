import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import SearchInput from '@/components/common/SearchInput';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import ServiceCatalogTable from '../components/ServiceCatalogTable';
import ServiceFormDialog from '../components/ServiceFormDialog';
import { Service } from '../types/settings';

export default function ServiceCatalog() {
  const [data, setData] = useState<Service[]>([
    { serviceId: 1, serviceName: 'Blood Test', serviceType: 'LAB_TEST', price: 25.00 },
    { serviceId: 2, serviceName: 'X-Ray Chest', serviceType: 'IMAGING', price: 45.00 }
  ]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState<Service | null>(null);

  return (
    <div className="space-y-6 flex flex-col h-full animate-in fade-in duration-500">
      <PageHeader 
        title="Service Catalog" 
        description="Manage all clinical services and pricing." 
        actionText="Add Service"
        onAction={() => setEditing({ serviceId: 0, serviceName: '', serviceType: 'EXAM', price: 0 })}
      />
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm shrink-0">
        <SearchInput value={search} onChange={setSearch} placeholder="Tìm kiếm services..." />
      </div>
      <ServiceCatalogTable 
        data={data.filter(s => s.serviceName.toLowerCase().includes(search.toLowerCase()))} 
        onEdit={setEditing} 
        onDelete={setDeleting} 
      />
      <ServiceFormDialog service={editing} onClose={() => setEditing(null)} onSave={() => setEditing(null)} />
      <ConfirmDialog 
        isOpen={!!deleting} 
        onClose={() => setDeleting(null)} 
        onConfirm={() => setDeleting(null)} 
        title="Delete Service" 
        description={`Confirm deletion of ${deleting?.serviceName}?`} 
      />
    </div>
  );
}