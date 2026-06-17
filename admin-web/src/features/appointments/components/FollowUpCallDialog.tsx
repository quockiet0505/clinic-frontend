// features/follow-ups/components/FollowUpCallDialog.tsx
import React, { useEffect, useState } from 'react';
import { PhoneCall } from 'lucide-react';
import FormDialog, { FieldConfig } from '@/components/common/FormDialog';

const fields: FieldConfig[] = [
  { 
    name: 'status', 
    label: 'Trạng thái mới', 
    type: 'select', 
    required: true, 
    options: [
      { value: 'COMPLETED', label: 'Hoàn thành' },
      { value: 'CONFIRMED', label: 'Đã xác nhận' },
      { value: 'CANCELLED', label: 'Đã hủy' },
    ],
    colSpan: 2,
  },
  { 
    name: 'result', 
    label: 'Kết quả / Ghi chú', 
    type: 'textarea', 
    required: true, 
    placeholder: 'Ví dụ: Bệnh nhân đã hẹn tái khám...', 
    rows: 3,
    colSpan: 2,
  },
];

interface Props {
  patient: any;
  onClose: () => void;
  onSubmit: (status: string, result: string) => void;
}

export default function FollowUpCallDialog({ patient, onClose, onSubmit }: Props) {
  const isOpen = !!patient;
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey(prev => prev + 1);
  }, [patient]);

  const handleSubmit = (data: any, isEdit: boolean) => {
    onSubmit(data.status, data.result);
  };

  if (!isOpen) return null;

  return (
    <FormDialog
      key={key}
      open={isOpen}
      onClose={onClose}
      title="Cập Nhật Trạng Thái"
      description={`Ghi chú kết quả cuộc gọi với ${patient.patientName}.`}
      icon={<PhoneCall size={16} />}
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel="Lưu Thay Đổi"
      initialData={{ status: 'COMPLETED', result: '' }}
      compact={true}
      columns={2}
    />
  );
}