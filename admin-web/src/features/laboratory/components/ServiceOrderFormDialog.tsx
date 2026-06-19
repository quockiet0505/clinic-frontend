import React, { useEffect, useState } from 'react';
import { FlaskConical } from 'lucide-react';
import FormDialog, { FieldConfig } from '@/components/common/FormDialog';
import { settingsApi } from '@/features/settings/api/settingsApi';
import { Service } from '@/features/settings/types/settings';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function ServiceOrderFormDialog({ isOpen, onClose, onSubmit }: Props) {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    if (isOpen) {
      settingsApi.getServicesPaged({ size: 100 }).then((res) => {
        // Chỉ cho phép bác sĩ chọn LAB_TEST và IMAGING
        const allowedServices = res.content.filter(
          s => s.serviceType === 'LAB_TEST' || s.serviceType === 'IMAGING'
        );
        setServices(allowedServices);
      }).catch(console.error);
    }
  }, [isOpen]);

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
      name: 'serviceId', 
      label: 'Chọn dịch vụ (Xét nghiệm / CĐHA)', 
      type: 'select', 
      required: true, 
      options: services.map(s => ({ value: String(s.serviceId), label: s.serviceName })),
      colSpan: 2,
    },
  ];

  const handleSubmit = (data: any) => {
    // Chuyển serviceId thành number
    onSubmit({ ...data, serviceId: Number(data.serviceId) });
  };

  return (
    <FormDialog
      open={isOpen}
      onClose={onClose}
      title="Tạo chỉ định dịch vụ"
      description="Chỉ định xét nghiệm hoặc chẩn đoán hình ảnh cho bệnh nhân."
      icon={<FlaskConical size={16} />}
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel="Tạo chỉ định"
      compact={true}
      columns={2}
    />
  );
}