import React from 'react';
import { Microscope } from 'lucide-react';
import FormDialog, { FieldConfig } from '@/components/common/FormDialog';

const fields: FieldConfig[] = [
  { 
    name: 'resultData', 
    label: 'Chỉ số xét nghiệm', 
    type: 'textarea', 
    required: true, 
    placeholder: 'e.g., WBC: 6.5, RBC: 4.8, HGB: 14.2...', 
    rows: 4,
    colSpan: 2,
  },
  { 
    name: 'conclusion', 
    label: 'Kết luận lâm sàng', 
    type: 'textarea', 
    required: true, 
    placeholder: 'e.g., All parameters within normal limits.', 
    rows: 3,
    colSpan: 2,
  },
  {
    name: 'attachmentUrlsString',
    label: 'Đường dẫn ảnh/file đính kèm (Phân cách bằng dấu phẩy)',
    type: 'text',
    required: false,
    placeholder: 'https://img1.com/a.png, https://img2.com/b.png',
    colSpan: 2,
  }
];

interface Props {
  order: any;
  onClose: () => void;
  onSubmit: (orderId: number, data: { resultData: string; conclusion: string; attachmentUrls?: string }) => void;
}

export default function LabResultInputForm({ order, onClose, onSubmit }: Props) {
  const isOpen = !!order;
  if (!isOpen) return null;

  const handleSubmit = (data: any) => {
    let attachmentUrlsJSON = undefined;
    if (data.attachmentUrlsString) {
      const urls = data.attachmentUrlsString.split(',').map((u: string) => u.trim()).filter((u: string) => u);
      attachmentUrlsJSON = JSON.stringify(urls);
    }
    onSubmit(order.orderId, { resultData: data.resultData, conclusion: data.conclusion, attachmentUrls: attachmentUrlsJSON });
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
      initialData={{ resultData: '', conclusion: '', attachmentUrlsString: '' }}
      compact={true}
      columns={2}
    />
  );
}