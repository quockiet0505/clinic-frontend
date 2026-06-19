// components/settings/ServiceFormDialog.tsx
import React from 'react';
import { Activity } from 'lucide-react';
import FormDialog, { FieldConfig } from '@/components/common/FormDialog';

const fields: FieldConfig[] = [
  { name: 'serviceName', label: 'Tên dịch vụ', type: 'text', required: true, placeholder: 'Ví dụ: Khám tổng quát' },
  { name: 'serviceType', label: 'Danh mục', type: 'select', required: true, options: [
    { value: 'EXAM', label: 'Khám bệnh' },
    { value: 'LAB_TEST', label: 'Xét nghiệm' },
    { value: 'IMAGING', label: 'Chẩn đoán hình ảnh' }
    { value: 'SURGERY', label: 'Phẫu thuật' },
    { value: 'OTHER', label: 'Khác' }
  ]},
  { name: 'originalPrice', label: 'Giá gốc (VNĐ)', type: 'number', required: true, placeholder: 'Ví dụ: 200000' },
  { name: 'discountPrice', label: 'Giá ưu đãi (VNĐ)', type: 'number', required: false, placeholder: 'Để trống nếu không có' },
];

interface Props {
  service: any;
  onClose: () => void;
  onSave: (id: number, data: any) => void;
}

export default function ServiceFormDialog({ service, onClose, onSave }: Props) {
  const isOpen = !!service;
  const isNew = service?.serviceId === 0;

  const initialData = service ? {
    serviceName: service.serviceName || '',
    serviceType: service.serviceType || 'EXAM',
    originalPrice: service.originalPrice || '',
    discountPrice: service.discountPrice || '',
  } : undefined;

  const handleSubmit = (data: any) => {
    onSave(service.serviceId, data);
  };

  if (!isOpen) return null;

  return (
    <FormDialog
      open={isOpen}
      onClose={onClose}
      title={isNew ? 'Thêm Dịch vụ' : 'Sửa Dịch vụ'}
      description="Cấu hình thông tin dịch vụ, giá gốc và giá ưu đãi (nếu có)."
      icon={<Activity size={16} />}
      fields={fields}
      initialData={initialData}
      onSubmit={handleSubmit}
      submitLabel="Lưu Dịch vụ"
      compact={true}
      columns={2}
    />
  );
}