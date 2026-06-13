// components/settings/ExpertiseFormDialog.tsx
import React from 'react';
import { Award } from 'lucide-react';
import FormDialog, { FieldConfig } from '@/components/common/FormDialog';

const expertiseFields: FieldConfig[] = [
  { name: 'name', label: 'Tên Chuyên khoa', type: 'text', required: true, placeholder: 'Ví dụ: Tim mạch' },
  { name: 'description', label: 'Mô tả', type: 'textarea', required: false, placeholder: 'Mô tả ngắn gọn...', rows: 2 },
  { name: 'status', label: 'Trạng thái', type: 'select', required: true, options: [
    { value: 'Active', label: 'Hoạt động' },
    { value: 'Inactive', label: 'Ngưng hoạt động' }
  ]}
];

export default function ExpertiseFormDialog({ expertise, onClose, onSave }: any) {
  const isOpen = !!expertise;
  const mappedInitial = expertise ? {
    name: expertise.expertiseName,
    description: expertise.description,
    status: expertise.status || 'Active'
  } : undefined;

  const handleSubmit = (data: any, isEdit: boolean) => {
    onSave(expertise?.expertiseId, data);
  };

  if (!isOpen) return null;

  return (
    <FormDialog
      open={isOpen}
      onClose={onClose}
      title={expertise?.expertiseId === 0 ? 'Thêm Chuyên khoa' : 'Sửa Chuyên khoa'}
      description="Cấu hình thông tin chi tiết và trạng thái hoạt động của chuyên khoa."
      icon={<Award size={16} />}
      fields={expertiseFields}
      initialData={mappedInitial}
      onSubmit={handleSubmit}
      submitLabel="Lưu thay đổi"
    />
  );
}