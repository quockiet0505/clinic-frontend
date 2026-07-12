import React, { useEffect, useMemo, useState } from 'react';
import { CalendarPlus } from 'lucide-react';
import FormDialog, { FieldConfig } from '@/components/common/FormDialog';
import { patientApi } from '@/features/patients/api/patientApi';
import { staffApi } from '@/features/staffs/api/staffApi';
import { settingsApi } from '@/features/settings/api/settingsApi';
import { Patient } from '@/features/patients/types/patient';
import { Staff } from '@/features/staffs/types/staff';
import { Expertise, Service } from '@/features/settings/types/settings';
import { useAuth } from '@/context/AuthContext';
import { isPatientBookableService } from '@/constants/serviceTypes';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onBook: (data: any) => void;
}

export default function AppointmentFormDialog({ isOpen, onClose, onBook }: Props) {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Staff[]>([]);
  const [expertises, setExpertises] = useState<Expertise[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [bookingFlow, setBookingFlow] = useState<'DOCTOR' | 'SERVICE'>('DOCTOR');
  const [selectedExpertiseId, setSelectedExpertiseId] = useState('');

  useEffect(() => {
    if (isOpen) {
      Promise.all([
        patientApi.getAllPaged({ size: 1000 }),
        staffApi.getAllPaged({ size: 100, staffType: 'DOCTOR' }),
        settingsApi.getExpertisesPaged({ size: 100 }),
        settingsApi.getServicesPaged({ size: 500 })
      ]).then(([patientRes, doctorRes, expertiseRes, serviceRes]) => {
        setPatients(patientRes.content);
        setDoctors(doctorRes.content);
        setExpertises(expertiseRes.content);
        setServices(serviceRes.content.filter((s) => isPatientBookableService(s.serviceType)));
      }).catch(console.error);
    } else {
      setBookingFlow('DOCTOR');
      setSelectedExpertiseId('');
    }
  }, [isOpen]);

  const filteredDoctors = useMemo(() => {
    if (!selectedExpertiseId) return doctors;
    return doctors.filter(d => String(d.expertiseId) === selectedExpertiseId);
  }, [doctors, selectedExpertiseId]);

  const fields: FieldConfig[] = [
    {
      name: 'patientId',
      label: 'Bệnh nhân',
      type: 'combobox',
      required: true,
      options: patients.map(p => ({ value: String(p.patientId), label: `${p.fullName} - ${p.phone} (#${p.patientId})` })),
      placeholder: 'Tìm tên, sđt hoặc mã...',
      colSpan: 2,
    },
    {
      name: 'bookingFlow',
      label: 'Loại đăng ký',
      type: 'select',
      required: true,
      colSpan: 2,
      options: [
        { value: 'DOCTOR', label: 'Khám bác sĩ (bắt buộc chọn chuyên khoa + bác sĩ)' },
        { value: 'SERVICE', label: 'Xét nghiệm / Chụp chiếu (không cần bác sĩ)' },
      ],
    },
    ...(bookingFlow === 'DOCTOR'
      ? [
          {
            name: 'expertiseId',
            label: 'Chuyên khoa',
            type: 'combobox' as const,
            required: true,
            options: expertises.map(e => ({ value: String(e.expertiseId), label: e.expertiseName })),
            placeholder: 'Chọn chuyên khoa',
          },
          {
            name: 'mainDoctorId',
            label: 'Bác sĩ',
            type: 'combobox' as const,
            required: true,
            options: filteredDoctors.map(d => ({ value: String(d.staffId), label: d.fullName })),
            placeholder: selectedExpertiseId ? 'Chọn bác sĩ' : 'Chọn chuyên khoa trước',
          },
        ]
      : [
          {
            name: 'serviceId',
            label: 'Dịch vụ xét nghiệm / chụp',
            type: 'combobox' as const,
            required: true,
            colSpan: 2 as const,
            options: services.map(s => ({ value: String(s.serviceId), label: s.serviceName })),
            placeholder: 'Chọn dịch vụ',
          },
        ]),
    {
      name: 'note',
      label: 'Lý do khám / Triệu chứng',
      type: 'textarea',
      required: true,
      placeholder: 'Ví dụ: Đau đầu, chóng mặt, sốt cao...',
      colSpan: 2,
    },
    {
      name: 'isPriority',
      label: 'Khách ưu tiên (Cấp cứu / Người già / VIP)',
      type: 'checkbox',
      colSpan: 2,
    },
  ];

  const validateForm = (data: Record<string, any>) => {
    if (!data.patientId || !data.note) return false;
    const flow = data.bookingFlow || bookingFlow;
    if (flow === 'DOCTOR') {
      return !!data.expertiseId && !!data.mainDoctorId;
    }
    return !!data.serviceId;
  };

  const handleSubmit = (data: any) => {
    const flow = data.bookingFlow || bookingFlow;
    const payload: Record<string, unknown> = {
      patientId: Number(data.patientId),
      note: data.note,
      isPriority: data.isPriority === true,
      appointmentType: 'WALK_IN',
      createdBy: user?.role === 'DOCTOR' ? 'DOCTOR' : (user?.role as any),
      appointmentDate: new Date().toISOString().split('T')[0],
      timeStart: new Date().toTimeString().split(' ')[0].substring(0, 5) + ':00',
      timeEnd: new Date(Date.now() + 30 * 60000).toTimeString().split(' ')[0].substring(0, 5) + ':00',
    };

    if (flow === 'DOCTOR') {
      payload.bookingMode = 'DOCTOR';
      payload.expertiseId = Number(data.expertiseId);
      payload.mainDoctorId = Number(data.mainDoctorId);
    } else {
      payload.bookingMode = 'SERVICE';
      payload.serviceId = Number(data.serviceId);
    }

    onBook(payload);
  };

  return (
    <FormDialog
      open={isOpen}
      onClose={onClose}
      title="Tạo lịch khám trực tiếp"
      description="Chỉ 2 luồng: khám bác sĩ (chọn khoa + BS) hoặc xét nghiệm/chụp (KTV xử lý, có check trùng lịch)."
      icon={<CalendarPlus size={16} />}
      fields={fields}
      initialData={{ bookingFlow: 'DOCTOR' }}
      validate={validateForm}
      onSubmit={handleSubmit}
      submitLabel="Lấy số khám"
      compact={false}
      columns={2}
      renderBeforeFields={({ formData, onChange }) => (
        <FormSync
          formData={formData}
          bookingFlow={bookingFlow}
          selectedExpertiseId={selectedExpertiseId}
          setBookingFlow={setBookingFlow}
          setSelectedExpertiseId={setSelectedExpertiseId}
          onChange={onChange}
        />
      )}
    />
  );
}

interface FormSyncProps {
  formData: Record<string, any>;
  bookingFlow: 'DOCTOR' | 'SERVICE';
  selectedExpertiseId: string;
  setBookingFlow: (flow: 'DOCTOR' | 'SERVICE') => void;
  setSelectedExpertiseId: (id: string) => void;
  onChange: (name: string, value: any, setTouchedFlag?: boolean) => void;
}

function FormSync({
  formData,
  bookingFlow,
  selectedExpertiseId,
  setBookingFlow,
  setSelectedExpertiseId,
  onChange,
}: FormSyncProps) {
  useEffect(() => {
    if (formData.bookingFlow && formData.bookingFlow !== bookingFlow) {
      setBookingFlow(formData.bookingFlow);
    }
  }, [formData.bookingFlow, bookingFlow, setBookingFlow]);

  useEffect(() => {
    const formExpId = formData.expertiseId ? String(formData.expertiseId) : '';
    if (formExpId !== selectedExpertiseId) {
      setSelectedExpertiseId(formExpId);
      if (formData.mainDoctorId) {
        onChange('mainDoctorId', '', false);
      }
    }
  }, [formData.expertiseId, selectedExpertiseId, formData.mainDoctorId, setSelectedExpertiseId, onChange]);

  return null;
}
