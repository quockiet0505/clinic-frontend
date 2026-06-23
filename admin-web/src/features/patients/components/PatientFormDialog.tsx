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
  { name: 'dateOfBirth', label: 'Ngày sinh', type: 'date', required: true },
  { name: 'phone', label: 'Số điện thoại', type: 'text', required: true, placeholder: 'Ví dụ: 0901234567' },
  { name: 'address', label: 'Địa chỉ', type: 'text', required: true, placeholder: 'Ví dụ: 123 Đường A, Quận 1, TP HCM', colSpan: 2 },
  
  // Vitals & Health History
  { name: 'height', label: 'Chiều cao (cm)', type: 'text', required: false, placeholder: 'Ví dụ: 170' },
  { name: 'weight', label: 'Cân nặng (kg)', type: 'text', required: false, placeholder: 'Ví dụ: 65' },
  { name: 'bloodPressure', label: 'Huyết áp (mmHg)', type: 'text', required: false, placeholder: 'Ví dụ: 120/80' },
  { name: 'pulse', label: 'Nhịp tim (bpm)', type: 'text', required: false, placeholder: 'Ví dụ: 80' },
  { name: 'bloodType', label: 'Nhóm máu', type: 'select', required: false, options: [
    { value: '', label: 'Chưa rõ' },
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'AB', label: 'AB' },
    { value: 'O', label: 'O' }
  ]},
  { name: 'allergies', label: 'Dị ứng', type: 'textarea', required: false, placeholder: 'Ví dụ: Dị ứng Penicillin...', colSpan: 2 },
  { name: 'medicalHistory', label: 'Tiền sử bệnh lý', type: 'textarea', required: false, placeholder: 'Ví dụ: Tiểu đường, Cao huyết áp...', colSpan: 2 }
];

export default function PatientFormDialog({ isOpen, onClose, onSubmit, initialData }: any) {
  return (
    <FormDialog
      open={isOpen}
      onClose={onClose}
      title={initialData ? 'Cập Nhật Hồ Sơ & Sức Khoẻ' : 'Đăng Ký Bệnh Nhân'}
      description="Cập nhật thông tin hành chính và tổng quan sức khoẻ bệnh nhân."
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