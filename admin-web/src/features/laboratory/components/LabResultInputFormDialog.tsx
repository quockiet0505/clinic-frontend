import React from 'react';
import { Microscope } from 'lucide-react';
import FormDialog, { FieldConfig } from '@/components/common/FormDialog';

const fields: FieldConfig[] = [
  { name: 'resultData', label: 'Chỉ số xét nghiệm', type: 'textarea', required: true, placeholder: 'e.g., WBC: 6.5, RBC: 4.8, HGB: 14.2...', rows: 4 },
  { name: 'conclusion', label: 'Kết luận lâm sàng', type: 'textarea', required: true, placeholder: 'e.g., All parameters within normal limits.', rows: 3 },
];

interface Props {
  order: any; // { orderId, patientName, serviceName }
  onClose: () => void;
  onSubmit: (orderId: number, data: { resultData: string; conclusion: string }) => void;
}

export default function LabResultInputForm({ order, onClose, onSubmit }: Props) {
  const isOpen = !!order;
  if (!isOpen) return null;

  const handleSubmit = (data: any) => {
    onSubmit(order.orderId, { resultData: data.resultData, conclusion: data.conclusion });
  };

  return (
    <FormDialog
      open={isOpen}
      onClose={onClose}
      title="Nhập kết quả xét nghiệm"
      description={`Ghi nhận kết quả cho ${order.patientName} (${order.serviceName}).`}
      icon={<Microscope size={16} />}
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel="Lưu kết quả"
      initialData={{ resultData: '', conclusion: '' }}
    />
  );
}