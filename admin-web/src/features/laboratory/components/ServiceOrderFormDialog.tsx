import React from 'react';
import { FlaskConical } from 'lucide-react';
import FormDialog, { FieldConfig } from '@/components/common/FormDialog';

const fields: FieldConfig[] = [
  { 
    name: 'patientName', 
    label: 'Tên bệnh nhân / Mã bệnh án', 
    type: 'text', 
    required: true, 
    placeholder: 'Tìm kiếm bệnh nhân...',
  },
  { 
    name: 'doctorName', 
    label: 'Bác sĩ chỉ định', 
    type: 'text', 
    required: true, 
    placeholder: 'vd: BS. Nguyễn Văn A',
  },
  { 
    name: 'serviceName', 
    label: 'Chọn xét nghiệm', 
    type: 'select', 
    required: true, 
    options: [
      { value: 'Complete Blood Count', label: 'Tổng phân tích tế bào máu' },
      { value: 'Lipid Panel', label: 'Bộ mỡ máu' },
      { value: 'Urinalysis', label: 'Xét nghiệm nước tiểu' },
      { value: 'Chest X-Ray', label: 'X-Quang ngực' },
    ],
    colSpan: 2,
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function ServiceOrderFormDialog({ isOpen, onClose, onSubmit }: Props) {
  const handleSubmit = (data: any) => {
    onSubmit({ ...data, serviceId: Math.floor(Math.random() * 10) + 1 });
  };

  return (
    <FormDialog
      open={isOpen}
      onClose={onClose}
      title="Tạo chỉ định xét nghiệm"
      description="Chỉ định một xét nghiệm mới cho bệnh nhân."
      icon={<FlaskConical size={16} />}
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel="Tạo chỉ định"
      compact={true}
      columns={2}
    />
  );
}