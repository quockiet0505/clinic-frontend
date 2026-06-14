import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/common/PageHeader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import MedicineFilterBar from '../components/MedicineFilterBar';
import MedicineTable from '../components/MedicineTable';
import MedicineFormDialog from '../components/MedicineFormDialog';
import { Medicine } from '../types/pharmacy';
import { pharmacyApi } from '../api/pharmacyApi';

export default function MedicineInventory() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingMed, setDeletingMed] = useState<Medicine | null>(null);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const data = await pharmacyApi.getMedicines();
      if (data && data.length > 0) {
        setMedicines(data);
      } else {
        setMedicines([
          { medicineId: 1, name: 'Paracetamol 500mg', activeElement: 'Paracetamol', unit: 'Viên', quantity: 1500, minStockLevel: 500, sellPrice: 1500, usageNote: 'Uống sau ăn' },
          { medicineId: 2, name: 'Amoxicillin 500mg', activeElement: 'Amoxicillin', unit: 'Viên', quantity: 800, minStockLevel: 300, sellPrice: 3500, usageNote: 'Dùng theo đơn' }
        ]);
      }
    } catch (e) {
      setMedicines([
        { medicineId: 1, name: 'Paracetamol 500mg', activeElement: 'Paracetamol', unit: 'Viên', quantity: 1500, minStockLevel: 500, sellPrice: 1500, usageNote: 'Uống sau ăn' }
      ]);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchMedicines();
  }, []);

  const handleFormSubmit = async (formData: any, isEdit: boolean) => {
    if (isEdit) {
      await pharmacyApi.updateMedicine(selectedMedicine!.medicineId, { ...formData, sellPrice: Number(formData.sellPrice), minStockLevel: Number(formData.minStockLevel) });
    } else {
      await pharmacyApi.createMedicine({ ...formData, sellPrice: Number(formData.sellPrice), minStockLevel: Number(formData.minStockLevel) });
    }
    await fetchMedicines();
    setIsFormOpen(false);
  };

  const filteredMedicines = medicines.filter(m => 
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.activeElement?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <PageHeader title="Kho thuốc" description="Quản lý danh mục thuốc, hoạt chất, giá cả và số lượng tồn kho." />
        <Button onClick={() => { setSelectedMedicine(null); setIsFormOpen(true); }} className="h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg text-white font-bold px-5 shadow-sm flex items-center gap-2">
          <Plus size={18}/> Thêm thuốc mới
        </Button>
      </div>

      <MedicineFilterBar search={searchTerm} setSearch={setSearchTerm} />

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Đang tải danh sách thuốc...</div>
      ) : (
        <MedicineTable data={filteredMedicines} onEdit={(med) => { setSelectedMedicine(med); setIsFormOpen(true); }} onDelete={setDeletingMed} />
      )}

      <MedicineFormDialog isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} initialData={selectedMedicine} />
      
      <ConfirmDialog isOpen={!!deletingMed} onClose={() => setDeletingMed(null)} onConfirm={async () => { 
        if (deletingMed) {
          await pharmacyApi.deleteMedicine(deletingMed.medicineId);
          await fetchMedicines();
        }
        setDeletingMed(null); 
      }} title="Xóa thuốc" description={`Bạn có chắc chắn muốn xóa thuốc ${deletingMed?.name} khỏi kho không?`} />
    </div>
  );
}