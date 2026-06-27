import React, { useEffect, useState } from 'react';
import { FlaskConical } from 'lucide-react';
import FormDialog, { FieldConfig } from '@/components/common/FormDialog';
import { settingsApi } from '@/features/settings/api/settingsApi';
import { Service } from '@/features/settings/types/settings';
import { medicalApi } from '@/features/medical/api/medicalApi';
import { staffApi } from '@/features/staffs/api/staffApi';
import { MedicalRecord } from '@/features/medical/types/medical';
import { Staff } from '@/features/staffs/types/staff';
import { useAuth } from '@/context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { recordId: number; serviceId: number; orderedById: number; customServiceName?: string; doctorNote?: string; }) => void;
  fixedRecordId?: number;
  fixedOrderedById?: number;
  patientLabel?: string;
}

export default function ServiceOrderFormDialog({
  isOpen,
  onClose,
  onSubmit,
  fixedRecordId,
  fixedOrderedById,
  patientLabel,
}: Props) {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [activeVisits, setActiveVisits] = useState<MedicalRecord[]>([]);
  const [doctors, setDoctors] = useState<Staff[]>([]);

  // Calculate default doctor ID
  const defaultDoctorId = (user?.role === 'DOCTOR' && user?.id) ? String(user.id) : undefined;

  useEffect(() => {
    if (isOpen) {
      settingsApi.getServicesPaged({ size: 100 }).then((res) => {
        // Chỉ cho phép bác sĩ chọn các dịch vụ cận lâm sàng (khác EXAM)
        const allowedServices = res.content.filter(
          s => s.serviceType !== 'EXAM'
        );
        setServices(allowedServices);
      }).catch(console.error);

      medicalApi.getActiveVisitsPaged({ size: 100 }).then((res) => {
        setActiveVisits(res.content);
      }).catch(console.error);

      if (!fixedOrderedById) {
        staffApi.getAllPaged({ size: 100, staffType: 'DOCTOR' }).then((res) => {
          setDoctors(res.content);
        }).catch(console.error);
      }
    }
  }, [isOpen, fixedOrderedById]);

  const fields: FieldConfig[] = [
    ...(fixedRecordId
      ? []
      : [{
          name: 'recordId',
          label: 'Bệnh nhân (Hồ sơ đang khám)',
          type: 'combobox' as const,
          required: true,
          options: activeVisits.map(v => ({ value: String(v.recordId), label: `${v.patientName} (#${v.recordId})` })),
          placeholder: 'Tìm tên hoặc mã HS...',
        }]),
    ...(fixedOrderedById
      ? []
      : [{
          name: 'orderedById',
          label: 'Bác sĩ chỉ định',
          type: 'combobox' as const,
          required: true,
          options: doctors.map(d => ({ value: String(d.staffId), label: d.fullName })),
          placeholder: 'Tìm tên bác sĩ...',
        }]),
    { 
      name: 'serviceId', 
      label: 'Chọn dịch vụ (Xét nghiệm / CĐHA)', 
      type: 'combobox', 
      required: true, 
      options: services.map(s => ({ value: String(s.serviceId), label: s.serviceName })),
      colSpan: 2,
    },
    {
      name: 'customServiceName',
      label: 'Tên dịch vụ khác (Nếu có)',
      type: 'text',
      required: false,
      placeholder: 'Chỉ nhập nếu chọn loại dịch vụ "Khác" (OTHER)',
      colSpan: 2,
    },
    {
      name: 'doctorNote',
      label: 'Ghi chú cho KTV',
      type: 'textarea',
      required: false,
      placeholder: 'Ghi chú thêm về vị trí chụp, yêu cầu đặc biệt...',
      colSpan: 2,
    }
  ];

  const handleSubmit = (data: Record<string, string>) => {
    onSubmit({
      recordId: fixedRecordId ?? Number(data.recordId),
      orderedById: fixedOrderedById ?? Number(data.orderedById),
      serviceId: Number(data.serviceId),
      customServiceName: data.customServiceName,
      doctorNote: data.doctorNote,
    } as any);
  };

  const initialData: Record<string, string> = {};
  if (fixedRecordId) initialData.recordId = String(fixedRecordId);
  if (fixedOrderedById) initialData.orderedById = String(fixedOrderedById);
  else if (defaultDoctorId) initialData.orderedById = defaultDoctorId;

  return (
    <FormDialog
      open={isOpen}
      onClose={onClose}
      title="Tạo chỉ định dịch vụ"
      description={
        patientLabel
          ? `Chỉ định xét nghiệm / CĐHA cho ${patientLabel}.`
          : 'Chỉ định xét nghiệm hoặc chẩn đoán hình ảnh cho bệnh nhân.'
      }
      icon={<FlaskConical size={16} />}
      fields={fields}
      initialData={Object.keys(initialData).length ? initialData : undefined}
      onSubmit={handleSubmit}
      submitLabel="Tạo chỉ định"
      compact={true}
      columns={2}
    />
  );
}
