import React from 'react';
import { Pill } from 'lucide-react';
import FormDialog, { FieldConfig } from '@/components/common/FormDialog';

const medicineFields: FieldConfig[] = [
  { name: 'name', label: 'Tên thuốc', type: 'text', required: true, placeholder: 'Ví dụ: Paracetamol 500mg' },
  { name: 'activeElement', label: 'Hoạt chất', type: 'text', required: true, placeholder: 'Ví dụ: Paracetamol' },
  { name: 'packingStandard', label: 'Quy cách đóng gói', type: 'text', required: true, placeholder: 'Ví dụ: Hộp 10 vỉ x 10 viên' },
  { name: 'unit', label: 'Đơn vị tính', type: 'text', required: true, placeholder: 'Viên, Lọ, Chai...' },
  { name: 'usageNote', label: 'Hướng dẫn sử dụng', type: 'text', required: false, placeholder: 'Ví dụ: Ngày uống 2 lần, mỗi lần 1 viên sau ăn' },
];

export default function MedicineFormDialog({ isOpen, onClose, onSubmit, initialData }: any) {
  return (
    <FormDialog
      open={isOpen}
      onClose={onClose}
      title={initialData ? 'Cập Nhật Thuốc' : 'Thêm Thuốc Mới'}
      description="Thiết lập thông tin chi tiết của thuốc."
      icon={<Pill size={16} />}
      fields={medicineFields}
      initialData={initialData}
      onSubmit={onSubmit}
      submitLabel="Lưu Thuốc"
    />
  );
}