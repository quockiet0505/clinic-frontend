// components/settings/PricingFormDialog.tsx
import React from 'react';
import { DollarSign } from 'lucide-react';
import FormDialog, { FieldConfig } from '@/components/common/FormDialog';

export default function PricingFormDialog({ doctor, onClose, onSave }: any) {
  const isOpen = !!doctor;
  const isNew = doctor?.id === 0;

  const getFields = (): FieldConfig[] => {
    const baseFields: FieldConfig[] = [
      { name: 'price', label: 'Phí khám (VNĐ)', type: 'number', required: true, placeholder: 'Ví dụ: 150000' }
    ];
    if (isNew) {
      return [
        {
          name: 'staffId', label: 'Chọn Bác sĩ', type: 'select', required: true, options: [
            { value: '1', label: 'BS. Nguyễn Văn A' },
            { value: '2', label: 'BS. Trần Thị B' }
          ]
        },
        {
          name: 'serviceId', label: 'Chọn Dịch vụ', type: 'select', required: true, options: [
            { value: '1', label: 'Khám tổng quát' },
            { value: '2', label: 'Khám chuyên khoa' }
          ]
        },
        ...baseFields
      ];
    }
    return baseFields;
  };

  const initialData = doctor ? {
    staffId: doctor.staffId?.toString() || '',
    serviceId: doctor.serviceId?.toString() || '',
    price: doctor.price?.toString() || ''
  } : undefined;

  const handleSubmit = (data: any) => {
    onSave(doctor.id, data);
  };

  if (!isOpen) return null;

  return (
    <FormDialog
      open={isOpen}
      onClose={onClose}
      title={isNew ? 'Thêm Phí khám Bác sĩ' : 'Cập nhật Phí khám'}
      description={isNew ? 'Chọn bác sĩ và cài đặt giá dịch vụ khám cụ thể.' : `Điều chỉnh giá khám cho bác sĩ ${doctor.doctorName}.`}
      icon={<DollarSign size={16} />}
      fields={getFields()}
      initialData={initialData}
      onSubmit={handleSubmit}
      submitLabel="Lưu Giá"
    />
  );
}