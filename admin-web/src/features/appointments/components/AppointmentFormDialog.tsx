import React from 'react';
import { CalendarPlus } from 'lucide-react';
import FormDialog, { FieldConfig } from '@/components/common/FormDialog';

const fields: FieldConfig[] = [
  { name: 'patientId', label: 'Mã bệnh nhân', type: 'text', required: true, placeholder: 'Ví dụ: PAT-101' },
  { name: 'mainDoctorId', label: 'Mã bác sĩ', type: 'text', required: true, placeholder: 'Ví dụ: STF-205' },
  { name: 'appointmentDate', label: 'Ngày khám', type: 'date', required: true },
  { name: 'timeStart', label: 'Giờ bắt đầu', type: 'time', required: true },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onBook: (data: any) => void;
  initialData?: any;
}

export default function AppointmentFormDialog({ isOpen, onClose, onBook, initialData }: Props) {
  return (
    <FormDialog
      open={isOpen}
      onClose={onClose}
      title="Đặt Lịch Trực Tiếp"
      description="Tạo lịch hẹn mới cho bệnh nhân tại phòng khám."
      icon={<CalendarPlus size={16} />}
      fields={fields}
      initialData={initialData}
      onSubmit={(data, isEdit) => onBook(data)}
      submitLabel="OK"
      compact={true}
      columns={2}
    />
  );
}