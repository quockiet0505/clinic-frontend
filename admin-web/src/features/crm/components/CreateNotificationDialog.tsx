import React from 'react';
import { BellRing } from 'lucide-react';
import FormDialog, { FieldConfig } from '@/components/common/FormDialog';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { type: 'EMAIL' | 'SYSTEM'; content: string; accountId?: number }) => void;
}

export default function CreateNotificationDialog({ isOpen, onClose, onCreate }: Props) {
  const fields: FieldConfig[] = [
    {
      name: 'type',
      label: 'Loại thông báo',
      type: 'select',
      required: true,
      options: [
        { value: 'SYSTEM', label: 'Hệ thống' },
        { value: 'EMAIL', label: 'Email' },
      ],
      colSpan: 2,
    },
    {
      name: 'content',
      label: 'Nội dung',
      type: 'textarea',
      required: true,
      placeholder: 'Nhập nội dung thông báo...',
      rows: 3,
      colSpan: 2,
    },
  ];

  const initialData = {
    type: 'SYSTEM',
    content: '',
  };

  return (
    <FormDialog
      open={isOpen}
      onClose={onClose}
      title="Tạo thông báo mới"
      description="Nhập thông tin để gửi thông báo đến bệnh nhân."
      icon={<BellRing size={20} />}
      fields={fields}
      initialData={initialData}
      onSubmit={(data) => {
        onCreate({
          type: data.type as 'EMAIL' | 'SYSTEM',
          content: data.content,
        });
      }}
      submitLabel="Gửi thông báo"
      cancelLabel="Hủy"
      compact={true}
      columns={2}
    />
  );
}