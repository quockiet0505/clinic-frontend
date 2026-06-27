// components/settings/ServiceFormDialog.tsx
import React, { useEffect, useState } from 'react';
import { Activity, Loader2 } from 'lucide-react';
import FormDialog, { FieldConfig } from '@/components/common/FormDialog';
import FileUpload from '@/components/common/FileUpload';
import { uploadApi } from '@/api/uploadApi';
import { getImageUrl } from '@/utils/image';

const fields: FieldConfig[] = [
  { name: 'serviceName', label: 'Tên dịch vụ', type: 'text', required: true, placeholder: 'Ví dụ: Xét nghiệm máu tổng quát', colSpan: 2 },
  {
    name: 'serviceType',
    label: 'Danh mục',
    type: 'select',
    required: true,
    options: [
      { value: 'LAB_TEST', label: 'Xét nghiệm' },
      { value: 'X_RAY', label: 'Chụp X-Quang' },
      { value: 'ULTRASOUND', label: 'Siêu âm (chỉ định trong khám)' },
      { value: 'CT_SCAN', label: 'Chụp CT (chỉ định trong khám)' },
      { value: 'MRI', label: 'Chụp MRI (chỉ định trong khám)' },
      { value: 'ENDOSCOPY', label: 'Nội soi (chỉ định trong khám)' },
      { value: 'OTHER', label: 'Khác (chỉ định trong khám)' },
    ],
  },
  { name: 'estimatedDuration', label: 'Thời gian ước tính (phút)', type: 'number', required: false, placeholder: '15' },
  { name: 'originalPrice', label: 'Giá gốc (VNĐ)', type: 'number', required: true, placeholder: '200000' },
  { name: 'discountPrice', label: 'Giá ưu đãi (VNĐ)', type: 'number', required: false, placeholder: 'Để trống nếu không có' },
  { name: 'description', label: 'Mô tả', type: 'textarea', required: false, placeholder: 'Mô tả ngắn về dịch vụ', rows: 3, colSpan: 2 },
  { name: 'isFeatured', label: 'Hiển thị nổi bật', type: 'checkbox', required: false },
  { name: 'featuredPriority', label: 'Thứ tự ưu tiên', type: 'number', required: false, placeholder: '0' },
];

interface Props {
  service: any;
  onClose: () => void;
  onSave: (id: number, data: any) => void;
}

export default function ServiceFormDialog({ service, onClose, onSave }: Props) {
  const isOpen = !!service;
  const isNew = service?.serviceId === 0;
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setImageUrl(service?.imageUrl || '');
    }
  }, [isOpen, service]);

  const initialData = service
    ? {
        serviceName: service.serviceName || '',
        serviceType: service.serviceType === 'EXAM' ? 'LAB_TEST' : (service.serviceType || 'LAB_TEST'),
        estimatedDuration: service.estimatedDuration ?? 15,
        originalPrice: service.originalPrice || '',
        discountPrice: service.discountPrice || '',
        description: service.description || '',
        isFeatured: service.isFeatured === true,
        featuredPriority: service.featuredPriority ?? 0,
      }
    : undefined;

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadApi.uploadImage(file);
      setImageUrl(url);
    } catch {
      /* toast: axios interceptor */
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (data: Record<string, any>) => {
    onSave(service.serviceId, {
      ...data,
      imageUrl: imageUrl || null,
      estimatedDuration: data.estimatedDuration ? Number(data.estimatedDuration) : 15,
      originalPrice: Number(data.originalPrice),
      discountPrice: data.discountPrice ? Number(data.discountPrice) : null,
      featuredPriority: data.featuredPriority ? Number(data.featuredPriority) : 0,
      isFeatured: data.isFeatured === true,
    });
  };

  if (!isOpen) return null;

  return (
    <FormDialog
      open={isOpen}
      onClose={onClose}
      title={isNew ? 'Thêm dịch vụ' : 'Sửa dịch vụ'}
      description="Cấu hình dịch vụ và tải ảnh minh họa. BN chỉ đặt lịch trực tiếp Xét nghiệm / X-Quang."
      icon={<Activity size={16} />}
      fields={fields}
      initialData={initialData}
      onSubmit={handleSubmit}
      submitLabel="Lưu dịch vụ"
      compact={true}
      columns={2}
      renderBeforeFields={() => (
        <div className="col-span-2 space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Ảnh minh họa dịch vụ</label>
          {uploading ? (
            <div className="flex items-center gap-2 text-sm text-slate-500 py-3">
              <Loader2 className="animate-spin" size={16} /> Đang tải ảnh...
            </div>
          ) : (
            <FileUpload onFileSelect={handleUpload} label="Chọn ảnh dịch vụ" accept="image/*" />
          )}
          {imageUrl ? (
            <div className="flex items-center gap-3 mt-2">
              <img
                src={getImageUrl(imageUrl)}
                alt="Preview"
                className="w-20 h-20 rounded-xl object-cover border border-slate-200"
              />
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="text-xs text-red-600 font-semibold hover:underline"
              >
                Xóa ảnh
              </button>
            </div>
          ) : null}
        </div>
      )}
    />
  );
}
