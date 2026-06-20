// features/pharmacy/pages/MedicineInventory.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Package } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import GradientButton from '@/components/common/GradientButton';
import { pharmacyApi } from '../api/pharmacyApi';
import { Medicine } from '../types/pharmacy';
import MedicineFilterBar from '../components/MedicineFilterBar';
import MedicineTable from '../components/MedicineTable';
import MedicineFormDialog from '../components/MedicineFormDialog';
import toast from 'react-hot-toast';

export default function MedicineInventory() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    try {
      const res = await pharmacyApi.getMedicinesPaged({
        search: search || undefined,
        page: currentPage - 1,
        size: pageSize,
        sortBy: 'name',
        sortDir: 'ASC',
      });
      setMedicines(res.content);
      setTotalElements(res.totalElements);
    } catch (error) {
      console.error('Lỗi lấy danh sách thuốc:', error);
      setMedicines([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [search, currentPage]);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

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
        toast.success('Xóa thuốc thành công');
        fetchMedicines();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Lỗi xóa thuốc');
      }
    }
  };

  const handleSave = async (data: Partial<Medicine>) => {
    try {
      if (selectedMedicine) {
        await pharmacyApi.updateMedicine(selectedMedicine.medicineId, data);
      } else {
        await pharmacyApi.createMedicine(data as Omit<Medicine, 'medicineId' | 'quantity'>);
      }
      toast.success(selectedMedicine ? 'Cập nhật thuốc thành công' : 'Thêm thuốc mới thành công');
      setIsDialogOpen(false);
      fetchMedicines();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi lưu thông tin thuốc');
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col gap-4 animate-in fade-in duration-500">
      <PageHeader title="Kho Dược Phẩm" description="Quản lý danh mục thuốc và vật tư y tế">
        <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold">
            <Package size={16} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Tổng số thuốc</p>
            <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{totalElements}</p>
          </div>
        </div>
        <GradientButton onClick={handleAdd} className="w-full sm:w-auto">Thêm thuốc mới</GradientButton>
      </PageHeader>

      <MedicineFilterBar search={search} setSearch={setSearch} />

      <div className="flex-1 min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <MedicineTable
          data={medicines}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          pagination={{ page: currentPage, size: pageSize, total: totalElements, onPageChange: setCurrentPage }}
        />
      </div>

      <MedicineFormDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} initialData={selectedMedicine} onSubmit={handleSave} />
    </div>
  );
}
