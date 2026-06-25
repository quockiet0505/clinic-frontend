import React, { useEffect, useMemo, useState } from 'react';
import { BellRing } from 'lucide-react';
import FormDialog, { FieldConfig } from '@/components/common/FormDialog';
import { patientApi } from '@/features/patients/api/patientApi';
import type { Patient } from '@/features/patients/types/patient';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { type: 'EMAIL' | 'SYSTEM'; content: string; accountId: number }) => void | Promise<void>;
}

export default function CreateNotificationDialog({ isOpen, onClose, onCreate }: Props) {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    patientApi.getAllPaged({ size: 1000 }).then((res) => {
      setPatients(res.content.filter((p) => p.accountId));
    });
  }, [isOpen]);

  const patientOptions = useMemo(
    () =>
      patients.map((p) => ({
        value: String(p.accountId),
        label: `${p.fullName} — ${p.phone}${p.email ? ` (${p.email})` : ''}`,
      })),
    [patients]
  );

  const fields: FieldConfig[] = [
    {
      name: 'accountId',
      label: 'Bệnh nhân (có tài khoản app/web)',
      type: 'combobox',
      required: true,
      options: patientOptions,
      placeholder: 'Tìm tên, SĐT hoặc email...',
      colSpan: 2,
    },
    {
      name: 'type',
      label: 'Loại thông báo',
      type: 'select',
      required: true,
      options: [
        { value: 'SYSTEM', label: 'Hệ thống (app/web)' },
        { value: 'EMAIL', label: 'Email (ghi nhận)' },
      ],
      colSpan: 2,
    },
    {
      name: 'content',
      label: 'Nội dung',
      type: 'textarea',
      required: true,
      placeholder: 'Nhập nội dung thông báo gửi cho bệnh nhân...',
      rows: 3,
      colSpan: 2,
    },
  ];

  return (
    <FormDialog
      open={isOpen}
      onClose={onClose}
      title="Gửi thông báo cho bệnh nhân"
      description="Thông báo SYSTEM hiển thị trên app/web của bệnh nhân. Chọn đúng người nhận."
      icon={<BellRing size={20} />}
      fields={fields}
      initialData={{ accountId: '', type: 'SYSTEM', content: '' }}
      onSubmit={(data) => {
        if (!data.accountId) return;
        onCreate({
          type: data.type as 'EMAIL' | 'SYSTEM',
          content: data.content,
          accountId: Number(data.accountId),
        });
      }}
      submitLabel="Gửi thông báo"
      cancelLabel="Hủy"
      compact
      columns={2}
    />
  );
}
