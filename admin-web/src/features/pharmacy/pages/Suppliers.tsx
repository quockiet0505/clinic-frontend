import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/common/PageHeader';
import SearchInput from '@/components/common/SearchInput';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import SupplierTable from '../components/SupplierTable';
import SupplierFormDialog from '../components/SupplierFormDialog';
import { Supplier } from '../types/pharmacy';

const INITIAL_SUPPLIERS: Supplier[] = [
  { supplierId: 1, supplierName: 'PharmaCorp Global', contactName: 'David Wilson', phone: '+1 555-0100', email: 'sales@pharmacorp.com', address: '123 Health Ave, NY', isActive: true },
  { supplierId: 2, supplierName: 'MedSupply Co.', contactName: 'Sarah Connor', phone: '+1 555-0200', email: 'orders@medsupply.com', address: '456 Care Blvd, CA', isActive: true },
];

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null);

  const filtered = suppliers.filter(s => s.supplierName.toLowerCase().includes(search.toLowerCase()) || s.contactName.toLowerCase().includes(search.toLowerCase()));

  const handleFormSubmit = (formData: any, isEdit: boolean) => {
    if (isEdit) setSuppliers(suppliers.map(s => s.supplierId === selectedSupplier?.supplierId ? { ...s, ...formData } : s));
    else setSuppliers([{ ...formData, supplierId: Date.now() }, ...suppliers]);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <PageHeader title="Vendors & Suppliers" description="Manage pharmaceutical partners and distributors." />
        <Button onClick={() => { setSelectedSupplier(null); setIsFormOpen(true); }} className="h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg text-white font-bold px-5 shadow-sm">
          <Plus size={18} className="mr-2"/> Add Supplier
        </Button>
      </div>

      <div className="bg-white p-3 rounded-2xl border border-slate-200 flex shadow-sm shrink-0 w-full sm:w-[400px]">
        <SearchInput value={search} onChange={setSearch} placeholder="Tìm kiếm by company or contact name..." />
      </div>

      <SupplierTable data={filtered} onEdit={(sup) => { setSelectedSupplier(sup); setIsFormOpen(true); }} onDelete={setDeletingSupplier} />

      <SupplierFormDialog isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} initialData={selectedSupplier} />
      
      <ConfirmDialog isOpen={!!deletingSupplier} onClose={() => setDeletingSupplier(null)} onConfirm={() => { setSuppliers(suppliers.filter(s => s.supplierId !== deletingSupplier?.supplierId)); setDeletingSupplier(null); }} title="Delete Supplier" description={`Are you sure you want to remove ${deletingSupplier?.supplierName}?`} />
    </div>
  );
}