// components/medicine/MedicineFormDialog.tsx
import React from 'react';
import { Pill } from 'lucide-react';
import FormDialog, { FieldConfig } from '@/components/common/FormDialog';

const medicineFields: FieldConfig[] = [
  { name: 'name', label: 'Tên thuốc', type: 'text', required: true, placeholder: 'Ví dụ: Paracetamol 500mg' },
  { name: 'activeElement', label: 'Hoạt chất', type: 'text', required: true, placeholder: 'Ví dụ: Paracetamol' },
  { name: 'unit', label: 'Đơn vị', type: 'text', required: true, placeholder: 'Viên, Lọ, Chai...' },
  { name: 'sellPrice', label: 'Giá bán (VNĐ)', type: 'number', required: true, placeholder: 'Ví dụ: 50000' },
  { name: 'min_stock_level', label: 'Tồn kho tối thiểu', type: 'number', required: true, placeholder: '10' },
  { name: 'productionUnit', label: 'Nhà sản xuất', type: 'text', required: true, placeholder: 'Ví dụ: Công ty Dược phẩm ABC' }
];

export default function MedicineFormDialog({ isOpen, onClose, onSubmit, initialData }: any) {
  return (
    <FormDialog
      open={isOpen}
      onClose={onClose}
      title={initialData ? 'Cập Nhật Thuốc' : 'Thêm Thuốc Mới'}
      description="Thiết lập chi tiết loại thuốc, giá cả và tồn kho."
      icon={<Pill size={16} />}
      fields={medicineFields}
      initialData={initialData}
      onSubmit={onSubmit}
      submitLabel="Lưu Thuốc"
    />
  );
}