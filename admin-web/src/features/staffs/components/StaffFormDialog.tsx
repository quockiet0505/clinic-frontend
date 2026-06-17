// components/staff/StaffFormDialog.tsx
import React from 'react';
import { Users } from 'lucide-react';
import FormDialog, { FieldConfig } from '@/components/common/FormDialog';

const staffFields: FieldConfig[] = [
  { name: 'fullName', label: 'Họ và Tên', type: 'text', required: true, placeholder: 'Ví dụ: Nguyễn Văn An' },
  { name: 'email', label: 'Địa chỉ Email', type: 'text', required: true, placeholder: 'Ví dụ: email@domain.com' },
  { name: 'phone', label: 'Số điện thoại', type: 'text', required: true, placeholder: 'Ví dụ: 0901234567' },
  { 
    name: 'staffType', 
    label: 'Vai trò', 
    type: 'select', 
    required: true, 
    options: [
      { value: 'DOCTOR', label: 'Bác sĩ' },
      { value: 'NURSE', label: 'Điều dưỡng' },
      { value: 'STAFF', label: 'Nhân viên' },
      { value: 'LAB_TECH', label: 'Kỹ thuật viên' },
      { value: 'PHARMACIST', label: 'Dược sĩ' }
    ]
  },
  { 
    name: 'isActive', 
    label: 'Trạng thái', 
    type: 'select', 
    required: true, 
    options: [
      { value: 'true', label: 'Hoạt động' },
      { value: 'false', label: 'Ngừng hoạt động' }
    ]
  },
];

export default function StaffFormDialog({ isOpen, onClose, onSubmit, initialData }: any) {
  const mappedInitial = initialData ? {
    ...initialData,
    isActive: initialData.isActive === true ? 'true' : 'false'
  } : undefined;

  const handleSubmit = (data: any, isEdit: boolean) => {
    const processed = { ...data, isActive: data.isActive === 'true' };
    onSubmit(processed, isEdit);
  };

  return (
    <FormDialog
      open={isOpen}
      onClose={onClose}
      title={initialData ? 'Chỉnh sửa Nhân viên' : 'Thêm Nhân viên Mới'}
      description="Quản lý thông tin chi tiết và quyền truy cập."
      icon={<Users size={16} />}
      fields={staffFields}
      initialData={mappedInitial}
      onSubmit={handleSubmit}
      submitLabel="Lưu Nhân viên"
      compact={true}
      columns={2}
    />
  );
}