import React, { useEffect, useState } from 'react';
import { CalendarPlus } from 'lucide-react';
import FormDialog, { FieldConfig } from '@/components/common/FormDialog';
import { patientApi } from '@/features/patients/api/patientApi';
import { staffApi } from '@/features/staffs/api/staffApi';
import { settingsApi } from '@/features/settings/api/settingsApi';
import { Patient } from '@/features/patients/types/patient';
import { Staff } from '@/features/staffs/types/staff';
import { Expertise, Service } from '@/features/settings/types/settings';
import { useAuth } from '@/context/AuthContext';

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

  useEffect(() => {
    if (isOpen) {
      // Load all necessary data
      Promise.all([
        patientApi.getAllPaged({ size: 1000 }),
        staffApi.getAllPaged({ size: 100, staffType: 'DOCTOR' }),
        settingsApi.getExpertisesPaged({ size: 100 }),
        settingsApi.getServicesPaged({ size: 500 })
      ]).then(([patientRes, doctorRes, expertiseRes, serviceRes]) => {
        setPatients(patientRes.content);
        setDoctors(doctorRes.content);
        setExpertises(expertiseRes.content);
        setServices(serviceRes.content);
      }).catch(console.error);
    }
  }, [isOpen]);

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
      name: 'expertiseId',
      label: 'Chuyên khoa',
      type: 'combobox',
      required: false,
      options: expertises.map(e => ({ value: String(e.expertiseId), label: e.expertiseName })),
      placeholder: 'Chọn chuyên khoa (Tuỳ chọn)',
    },
    {
      name: 'serviceId',
      label: 'Dịch vụ khám',
      type: 'combobox',
      required: false,
      options: services.map(s => ({ value: String(s.serviceId), label: s.serviceName })),
      placeholder: 'Chọn dịch vụ (Tuỳ chọn)',
    },
    {
      name: 'mainDoctorId',
      label: 'Bác sĩ chỉ định',
      type: 'combobox',
      required: false,
      options: doctors.map(d => ({ value: String(d.staffId), label: d.fullName })),
      placeholder: 'Chọn bác sĩ (Tuỳ chọn)',
      colSpan: 2,
    },
    {
      name: 'note',
      label: 'Lý do khám / Triệu chứng',
      type: 'textarea',
      required: true,
      placeholder: 'Ví dụ: Đau đầu, chóng mặt, sốt cao... (Bắt buộc)',
      colSpan: 2,
    }
  ];

  const validateForm = (data: Record<string, any>) => {
    // Patient and Note are required by default (isRequiredMissing handles it but we can double check)
    const hasPatient = !!data.patientId;
    const hasNote = !!data.note;
    // Must select at least one of these 3
    const hasDoctorOrExpertiseOrService = !!data.mainDoctorId || !!data.expertiseId || !!data.serviceId;
    
    return hasPatient && hasNote && hasDoctorOrExpertiseOrService;
  };

  const handleSubmit = (data: any) => {
    const payload = {
      ...data,
      patientId: data.patientId ? Number(data.patientId) : undefined,
      expertiseId: data.expertiseId ? Number(data.expertiseId) : undefined,
      serviceId: data.serviceId ? Number(data.serviceId) : undefined,
      mainDoctorId: data.mainDoctorId ? Number(data.mainDoctorId) : undefined,
      appointmentType: 'WALK_IN',
      createdBy: user?.role === 'DOCTOR' ? 'DOCTOR' : 'STAFF',
      // We pass the current date and time so the backend accepts it.
      // The backend will generate the queue number and set checkin_time automatically.
      appointmentDate: new Date().toISOString().split('T')[0],
      timeStart: new Date().toTimeString().split(' ')[0].substring(0, 5) + ':00', // HH:mm:ss
      timeEnd: new Date(Date.now() + 30 * 60000).toTimeString().split(' ')[0].substring(0, 5) + ':00', // HH:mm:ss
    };
    
    // Default Booking Mode based on selection
    if (payload.mainDoctorId) {
      payload.bookingMode = 'DOCTOR';
    } else if (payload.serviceId) {
      payload.bookingMode = 'SERVICE';
    } else if (payload.expertiseId) {
      payload.bookingMode = 'EXPERTISE';
    } else {
      payload.bookingMode = 'DIRECT';
    }

    onBook(payload);
  };

  return (
    <FormDialog
      open={isOpen}
      onClose={onClose}
      title="Tạo Lịch Khám Trực Tiếp"
      description="Đăng ký lịch khám cho bệnh nhân walk-in. Vui lòng chọn ít nhất 1 trong 3 trường: Chuyên khoa, Dịch vụ hoặc Bác sĩ."
      icon={<CalendarPlus size={16} />}
      fields={fields}
      validate={validateForm}
      onSubmit={handleSubmit}
      submitLabel="Lấy số khám"
      compact={false}
      columns={2}
    />
  );
}