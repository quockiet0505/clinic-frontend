import React, { useEffect, useState } from 'react';
import { DollarSign } from 'lucide-react';
import FormDialog, { FieldConfig } from '@/components/common/FormDialog';
import { staffApi } from '@/features/staffs/api/staffApi';
import { Staff } from '@/features/staffs/types/staff';
import type { DoctorPricing } from '../types/settings';

interface Props {
  doctor: DoctorPricing | null;
  onClose: () => void;
  onSave: (id: number, data: { staffId: number; originalPrice: number; discountAmount: number }) => void;
}

export default function DoctorPricingFormDialog({ doctor, onClose, onSave }: Props) {
  const isOpen = !!doctor;
  const isNew = doctor?.id === 0;
  const [doctors, setDoctors] = useState<Staff[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    staffApi.getAllPaged({ size: 200, staffType: 'DOCTOR' })
      .then(res => setDoctors(res.content))
      .catch(console.error);
  }, [isOpen]);

  const fields: FieldConfig[] = isNew
    ? [
        {
          name: 'staffId',
          label: 'Bác sĩ',
          type: 'combobox',
          required: true,
          colSpan: 2,
          placeholder: 'Chọn bác sĩ',
          options: doctors.map(d => ({ value: String(d.staffId), label: d.fullName })),
        },
        { name: 'originalPrice', label: 'Giá gốc (VNĐ)', type: 'number', required: true, placeholder: '300000' },
        { name: 'discountAmount', label: 'Giá ưu đãi (VNĐ)', type: 'number', required: false, placeholder: 'Để trống = giá gốc' },
      ]
    : [
        { name: 'originalPrice', label: 'Giá gốc (VNĐ)', type: 'number', required: true, placeholder: '300000' },
        { name: 'discountAmount', label: 'Giá ưu đãi (VNĐ)', type: 'number', required: false, placeholder: 'Để trống = giá gốc' },
      ];

  const initialData = doctor
    ? {
        staffId: doctor.staffId?.toString() || '',
        originalPrice: doctor.originalPrice ?? doctor.price ?? '',
        discountAmount: doctor.discountAmount ?? '',
      }
    : undefined;

  const handleSubmit = (data: Record<string, any>) => {
    const originalPrice = Number(data.originalPrice);
    if (!Number.isFinite(originalPrice) || originalPrice < 0) return;
    const discountAmount = data.discountAmount !== '' && data.discountAmount != null
      ? Number(data.discountAmount)
      : originalPrice;
    onSave(doctor!.id, {
      staffId: isNew ? Number(data.staffId) : doctor!.staffId,
      originalPrice,
      discountAmount,
    });
  };

  if (!isOpen) return null;

  return (
    <FormDialog
      open={isOpen}
      onClose={onClose}
      title={isNew ? 'Thêm phí khám bác sĩ' : 'Cập nhật phí khám'}
      description="Phí khám theo từng bác sĩ — không gắn dịch vụ EXAM."
      icon={<DollarSign size={16} />}
      fields={fields}
      initialData={initialData}
      onSubmit={handleSubmit}
      submitLabel="Lưu giá"
      compact={true}
      columns={2}
      validate={(data) => {
        if (isNew && !data.staffId) return false;
        return data.originalPrice !== '' && data.originalPrice != null;
      }}
      renderBeforeFields={!isNew ? () => (
        <div className="col-span-2 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
          <p className="text-xs font-bold text-slate-500 uppercase">Bác sĩ</p>
          <p className="text-sm font-semibold text-slate-800 mt-1">{doctor?.doctorName}</p>
        </div>
      ) : undefined}
    />
  );
}
