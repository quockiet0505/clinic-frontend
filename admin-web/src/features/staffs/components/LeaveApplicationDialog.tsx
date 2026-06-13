import React from 'react';
import { CalendarDays } from 'lucide-react';
import FormDialog, { FieldConfig } from '@/components/common/FormDialog';

const fields: FieldConfig[] = [
  { name: 'leaveType', label: 'Loại nghỉ phép', type: 'select', required: true, options: [
    { value: 'ANNUAL', label: 'Nghỉ phép năm' },
    { value: 'SICK', label: 'Nghỉ ốm' },
    { value: 'UNPAID', label: 'Nghỉ không lương' },
    { value: 'OTHER', label: 'Khác' }
  ]},
  { name: 'fromDate', label: 'Từ ngày', type: 'date', required: true },
  { name: 'toDate', label: 'Đến ngày', type: 'date', required: true },
  { name: 'reason', label: 'Lý do', type: 'textarea', required: true, placeholder: 'Ví dụ: Nghỉ ốm đi khám bệnh', rows: 3 },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function LeaveApplicationDialog({ isOpen, onClose, onSubmit }: Props) {
  const getInitialData = () => {
    const today = new Date().toISOString().split('T')[0];
    return { leaveType: 'ANNUAL', fromDate: today, toDate: today, reason: '' };
  };

  return (
    <FormDialog
      open={isOpen}
      onClose={onClose}
      title="Nộp Đơn Xin Nghỉ"
      description="Điền thông tin chi tiết cho đơn xin nghỉ của bạn."
      icon={<CalendarDays size={16} />}
      fields={fields}
      initialData={getInitialData()}
      onSubmit={(data) => onSubmit(data)}
      submitLabel="Gửi Đơn"
    />
  );
}