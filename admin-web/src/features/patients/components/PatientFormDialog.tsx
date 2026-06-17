// components/patient/PatientFormDialog.tsx
import React from 'react';
import { UserRound } from 'lucide-react';
import FormDialog, { FieldConfig } from '@/components/common/FormDialog';

const patientFields: FieldConfig[] = [
  { name: 'fullName', label: 'Họ và tên', type: 'text', required: true, placeholder: 'Ví dụ: Nguyễn Văn A' },
  { name: 'gender', label: 'Giới tính', type: 'select', required: true, options: [
    { value: 'MALE', label: 'Nam' },
    { value: 'FEMALE', label: 'Nữ' },
    { value: 'OTHER', label: 'Khác' }
  ]},
  { name: 'date_of_birth', label: 'Ngày sinh', type: 'date', required: true },
  { name: 'phone', label: 'Số điện thoại', type: 'text', required: true, placeholder: 'Ví dụ: 0901234567' },
  { name: 'address', label: 'Địa chỉ', type: 'text', required: true, placeholder: 'Ví dụ: 123 Đường A, Quận 1, TP HCM' }
];

export default function PatientFormDialog({ isOpen, onClose, onSubmit, initialData }: any) {
  return (
    <FormDialog
      open={isOpen}
      onClose={onClose}
      title={initialData ? 'Cập Nhật Thông Tin' : 'Đăng Ký Bệnh Nhân'}
      description="Đảm bảo thông tin liên lạc và nhân khẩu học chính xác."
      icon={<UserRound size={16} />}
      fields={patientFields}
      initialData={initialData}
      onSubmit={onSubmit}
      submitLabel="Lưu Bệnh Nhân"
      compact={true}
      columns={2}
    />
  );
}