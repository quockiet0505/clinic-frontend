import React, { useState, useEffect } from 'react';
import { pharmacyApi } from '../api/pharmacyApi';
import { Medicine } from '../types/pharmacy';
import MedicineFilterBar from '../components/MedicineFilterBar';
import MedicineTable from '../components/MedicineTable';
import MedicineFormDialog from '../components/MedicineFormDialog';

export default function MedicineInventory() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const data = await pharmacyApi.getMedicines();
      setMedicines(data);
    } catch (error) {
      console.error("Lỗi lấy danh sách thuốc:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleAdd = () => {
    setSelectedMedicine(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsDialogOpen(true);
  };

  const handleDelete = async (medicine: Medicine) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa thuốc ${medicine.name}?`)) {
      try {
        await pharmacyApi.deleteMedicine(medicine.medicineId);
        fetchMedicines();
      } catch (error) {
        console.error("Lỗi xóa thuốc:", error);
      }
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (selectedMedicine) {
        await pharmacyApi.updateMedicine(selectedMedicine.medicineId, data);
      } else {
        await pharmacyApi.createMedicine(data);
      }
      setIsDialogOpen(false);
      fetchMedicines();
    } catch (error) {
      console.error("Lỗi lưu thuốc:", error);
    }
  };

  const filteredData = medicines.filter(med => 
    med.name.toLowerCase().includes(search.toLowerCase()) || 
    (med.activeElement && med.activeElement.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Kho Dược Phẩm</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Quản lý danh mục thuốc và vật tư y tế</p>
        </div>
      </div>

      <MedicineFilterBar search={search} setSearch={setSearch} onAdd={handleAdd} />

      <div className="flex-1 min-h-0">
        {loading ? (
          <div className="flex justify-center items-center h-full bg-white rounded-2xl border border-slate-200">
            <span className="text-slate-400 font-medium">Đang tải dữ liệu kho thuốc...</span>
          </div>
        ) : (
          <MedicineTable data={filteredData} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>

      <MedicineFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        initialData={selectedMedicine}
        onSubmit={handleSave}
      />
    </div>
  );
}