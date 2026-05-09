import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/common/PageHeader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import MedicineFilterBar from '../components/MedicineFilterBar';
import MedicineTable from '../components/MedicineTable';
import MedicineFormDialog from '../components/MedicineFormDialog';
import { Medicine } from '../types/pharmacy';

const INITIAL_MEDICINES: Medicine[] = [
  { medicine_id: 101, name: 'Amoxil', active_element: 'Amoxicillin 500mg', production_unit: 'PharmaCorp', unit: 'Tablet', sell_price: 1.50, quantity: 450, min_stock_level: 100 },
  { medicine_id: 104, name: 'Lipitor', active_element: 'Atorvastatin 20mg', production_unit: 'MedInc', unit: 'Tablet', sell_price: 2.20, quantity: 10, min_stock_level: 50 },
];

export default function MedicineInventory() {
  const [medicines, setMedicines] = useState(INITIAL_MEDICINES);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingMed, setDeletingMed] = useState<Medicine | null>(null);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  const handleFormSubmit = (formData: any, isEdit: boolean) => {
    if (isEdit) setMedicines(medicines.map(m => m.medicine_id === selectedMedicine?.medicine_id ? { ...m, ...formData, sell_price: Number(formData.sell_price), min_stock_level: Number(formData.min_stock_level) } : m));
    else setMedicines([{ ...formData, medicine_id: Date.now(), quantity: 0, sell_price: Number(formData.sell_price), min_stock_level: Number(formData.min_stock_level) }, ...medicines]);
    setIsFormOpen(false);
  };

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.active_element.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <PageHeader title="Pharmacy Inventory" description="Manage drug catalog, active elements, pricing, and stock levels." />
        <Button onClick={() => { setSelectedMedicine(null); setIsFormOpen(true); }} className="h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 shadow-sm">
          <Plus size={18} className="mr-2"/> Add Medicine
        </Button>
      </div>

      <MedicineFilterBar search={searchTerm} setSearch={setSearchTerm} />

      <MedicineTable data={filteredMedicines} onEdit={(med) => { setSelectedMedicine(med); setIsFormOpen(true); }} onDelete={setDeletingMed} />

      <MedicineFormDialog isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} initialData={selectedMedicine} />
      
      <ConfirmDialog isOpen={!!deletingMed} onClose={() => setDeletingMed(null)} onConfirm={() => { setMedicines(medicines.filter(m => m.medicine_id !== deletingMed?.medicine_id)); setDeletingMed(null); }} title="Delete Medicine" description={`Are you sure you want to delete ${deletingMed?.name} from the inventory catalog?`} />
    </div>
  );
}