// components/patient/PatientFormDialog.tsx
import React from 'react';
import { UserRound } from 'lucide-react';
import FormDialog, { FieldConfig } from '@/components/common/FormDialog';
import { BLOOD_TYPE_OPTIONS } from '@/constants/bloodTypes';

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
  { name: 'bloodType', label: 'Nhóm máu', type: 'select', required: false, placeholder: 'Chọn nhóm máu', options: BLOOD_TYPE_OPTIONS },
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
      validate={(data) => {
        const errs: Record<string, string> = {};
        
        if (data.phone) {
          const phoneRegex = /^(84|0[3|5|7|8|9])+([0-9]{8})\b/;
          if (!phoneRegex.test(String(data.phone))) {
            errs.phone = 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0 hoặc 84)';
          }
        }
        
        if (data.dateOfBirth) {
          const dob = new Date(data.dateOfBirth);
          if (dob > new Date()) {
            errs.dateOfBirth = 'Ngày sinh không được lớn hơn ngày hiện tại';
          }
        }

        // Height, Weight, Pulse format validation (must be numbers > 0 if provided)
        if (data.height && (isNaN(Number(data.height)) || Number(data.height) <= 0 || Number(data.height) > 300)) {
          errs.height = 'Chiều cao không hợp lệ';
        }
        if (data.weight && (isNaN(Number(data.weight)) || Number(data.weight) <= 0 || Number(data.weight) > 500)) {
          errs.weight = 'Cân nặng không hợp lệ';
        }
        if (data.pulse && (isNaN(Number(data.pulse)) || Number(data.pulse) <= 0)) {
          errs.pulse = 'Nhịp tim không hợp lệ';
        }

        return errs;
      }}
    />
  );
}