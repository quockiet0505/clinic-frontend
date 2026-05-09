import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import SearchInput from '@/components/common/SearchInput';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import ServiceCatalogTable from '../components/ServiceCatalogTable';
import ServiceFormDialog from '../components/ServiceFormDialog';
import { Service } from '../types/settings';

export default function ServiceCatalog() {
  const [data, setData] = useState<Service[]>([
    { service_id: 1, service_name: 'Blood Test', service_type: 'LAB_TEST', price: 25.00 },
    { service_id: 2, service_name: 'X-Ray Chest', service_type: 'IMAGING', price: 45.00 }
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
        onAction={() => setEditing({ service_id: 0, service_name: '', service_type: 'EXAM', price: 0 })}
      />
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm shrink-0">
        <SearchInput value={search} onChange={setSearch} placeholder="Search services..." />
      </div>
      <ServiceCatalogTable 
        data={data.filter(s => s.service_name.toLowerCase().includes(search.toLowerCase()))} 
        onEdit={setEditing} 
        onDelete={setDeleting} 
      />
      <ServiceFormDialog service={editing} onClose={() => setEditing(null)} onSave={() => setEditing(null)} />
      <ConfirmDialog 
        isOpen={!!deleting} 
        onClose={() => setDeleting(null)} 
        onConfirm={() => setDeleting(null)} 
        title="Delete Service" 
        description={`Confirm deletion of ${deleting?.service_name}?`} 
      />
    </div>
  );
}