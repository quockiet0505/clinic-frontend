// features/crm/components/NotificationDialog.tsx
import React from 'react';
import { BellRing } from 'lucide-react';
import FormDialog, { FieldConfig } from '@/components/common/FormDialog';

const fields: FieldConfig[] = [
  {
    name: 'type',
    label: 'Hình thức gửi',
    type: 'select',
    required: true,
    options: [
      { value: 'SYSTEM', label: 'Thông báo trên ứng dụng' },
      { value: 'EMAIL', label: 'Gửi Email' },
    ],
    colSpan: 2,
  },
  {
    name: 'content',
    label: 'Nội dung',
    type: 'textarea',
    required: true,
    placeholder: 'Ví dụ: Lịch hẹn tái khám của bạn sắp đến...',
    rows: 3,
    colSpan: 2,
  },
];

interface Props {
  patient: any;
  onClose: () => void;
  onSend: (type: string, content: string) => void;
}

export default function NotificationDialog({ patient, onClose, onSend }: Props) {
  const isOpen = !!patient;
  if (!isOpen) return null;

  return (
    <FormDialog
      open={isOpen}
      onClose={onClose}
      title={`Nhắc nhở ${patient.patientName}`}
      description="Hệ thống sẽ gửi thông báo đến bệnh nhân này."
      icon={<BellRing size={16} />}
      fields={fields}
      onSubmit={(data) => onSend(data.type, data.content)}
      submitLabel="Gửi Thông Báo"
      initialData={{ type: 'SYSTEM', content: '' }}
      compact={true}
      columns={2}
    />
  );
}