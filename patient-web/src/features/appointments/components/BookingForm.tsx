import React, { useCallback, useEffect, useState } from 'react';
import { Activity, Stethoscope, BriefcaseMedical, CalendarDays, FileText, CheckCircle2 } from 'lucide-react';
import { FormSearchModal, FormTextarea } from '@/components/common';
import { TimeSlotPicker } from './TimeSlotPicker';
import { appointmentApi } from '../api/appointmentApi';
import { useToast } from '@/hooks/useToast';
import type { BookingFormState, AvailableDate, Doctor, Expertise, Service, TimeSlot } from '../types/appointment';

interface BookingFormProps {
  preselectedExpertiseId?: number;
  preselectedDoctorId?: number;
  preselectedServiceId?: number;
  isDoctorBooking: boolean;
  isExpertiseBooking: boolean;
  isServiceBooking: boolean;
  mode?: 'doctor' | 'service';
  onSubmit: (data: BookingFormState) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  preselectedExpertiseId,
  preselectedDoctorId,
  preselectedServiceId,
  isDoctorBooking,
  isExpertiseBooking,
  isServiceBooking,
  mode,
  onSubmit,
}) => {
  const [expertises, setExpertises] = useState<Expertise[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [dates, setDates] = useState<AvailableDate[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState({ doctor: false, service: false });
  const { toast } = useToast();

  const [formData, setFormData] = useState<BookingFormState>({
    expertiseId: preselectedExpertiseId ?? '',
    serviceId: preselectedServiceId ?? '',
    doctorId: preselectedDoctorId ?? '',
    appointmentDate: '',
    timeStart: '',
    timeEnd: '',
    description: '',
  });

  const showExpertise = !isServiceBooking && mode !== 'service';
  const showDoctor = !isServiceBooking && mode !== 'service';   
  const showService = isServiceBooking || mode === 'service';

  const expertiseDisabled = isDoctorBooking || isExpertiseBooking;
  const doctorDisabled = isDoctorBooking;
  const serviceDisabled = isServiceBooking;

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [exps, servs, avDates] = await Promise.all([
          appointmentApi.getExpertises(),
          appointmentApi.getServices(),
          appointmentApi.getAvailableDates(),
        ]);
        setExpertises(exps);
        setServices(servs);
        setDates(avDates);
      } catch {
        toast({ title: 'Lỗi', description: 'Không thể tải dữ liệu đặt khám', variant: 'destructive' });
      }
    };
    fetchInitial();
  }, [toast]);

  useEffect(() => {
    if (!preselectedDoctorId) return;
    setLoading(prev => ({ ...prev, doctor: true }));
    appointmentApi.getDoctorById(preselectedDoctorId)
      .then(doctor => {
        setFormData(prev => ({
          ...prev,
          doctorId: doctor.staffId,
          expertiseId: doctor.expertiseId ?? '',
        }));
        if (doctor.expertiseId) {
          return appointmentApi.getDoctorsByExpertise(doctor.expertiseId);
        }
        return [];
      })
      .then(doctorList => {
        setDoctors(doctorList);
      })
      .catch(console.error)
      .finally(() => setLoading(prev => ({ ...prev, doctor: false })));
  }, [preselectedDoctorId]);

  useEffect(() => {
    if (!preselectedExpertiseId || preselectedDoctorId) return;
    appointmentApi.getDoctorsByExpertise(preselectedExpertiseId)
      .then(setDoctors)
      .catch(console.error);
  }, [preselectedExpertiseId, preselectedDoctorId]);

  useEffect(() => {
    if (!formData.expertiseId || expertiseDisabled || isDoctorBooking) return;
    appointmentApi.getDoctorsByExpertise(Number(formData.expertiseId))
      .then(setDoctors)
      .catch(console.error);
  }, [formData.expertiseId, expertiseDisabled, isDoctorBooking]);

  useEffect(() => {
    if (!formData.appointmentDate || (!formData.doctorId && showDoctor)) {
      setTimeSlots([]);
      return;
    }
    const targetDoctor = showDoctor ? Number(formData.doctorId) : 0;
    appointmentApi.getTimeSlots(formData.appointmentDate, targetDoctor)
      .then(setTimeSlots)
      .catch(console.error);
  }, [formData.appointmentDate, formData.doctorId, showDoctor]);

  const updateFormData = useCallback((data: Partial<BookingFormState>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  const handleSubmit = async () => {
    if (!formData.appointmentDate || !formData.timeStart || !formData.description.trim()) {
      toast({ title: 'Thiếu thông tin', description: 'Vui lòng điền đầy đủ các thông tin bắt buộc', variant: 'destructive' });
      return;
    }
    try {
      const result = await appointmentApi.createAppointment(formData);
      if (result.success) {
        onSubmit(formData);
      } else {
        toast({ title: 'Lỗi', description: result.message, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Lỗi', description: 'Không thể tạo lịch hẹn', variant: 'destructive' });
    }
  };

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      expertiseId: preselectedExpertiseId ?? '',
      serviceId: preselectedServiceId ?? '',
      doctorId: preselectedDoctorId ?? '',
      timeStart: '',
      timeEnd: '',
    }));
  }, [preselectedExpertiseId, preselectedServiceId, preselectedDoctorId]);

  const isFormValid = Boolean(formData.appointmentDate && formData.timeStart && formData.description.trim());

  // TÍNH TOÁN TRẠNG THÁI TIẾN TRÌNH
  const isStep1Done = Boolean(formData.appointmentDate && formData.timeStart);
  const isStep2Done = Boolean(isStep1Done && formData.description.trim().length > 0);
  const isStep3Done = isFormValid;

  const getExpertiseOptions = () => {
    if (expertiseDisabled && formData.expertiseId) {
      const found = expertises.find(e => e.expertiseId === Number(formData.expertiseId));
      if (found) return [{ value: String(found.expertiseId), label: found.expertiseName, icon: Activity }];
      if (loading.doctor) return [{ value: String(formData.expertiseId), label: 'Đang tải...', icon: Activity }];
    }
    return expertises.map(e => ({ value: String(e.expertiseId), label: e.expertiseName, description: e.description, icon: Activity }));
  };

  const getServiceOptions = () => {
    if (serviceDisabled && preselectedServiceId) {
      const found = services.find(s => s.serviceId === preselectedServiceId);
      if (found) return [{ value: String(found.serviceId), label: found.serviceName, description: found.description, icon: BriefcaseMedical }];
      return [{ value: String(preselectedServiceId), label: 'Đang tải...', icon: BriefcaseMedical }];
    }
    return services.map(s => ({ value: String(s.serviceId), label: `${s.serviceName} - ${s.price.toLocaleString('vi-VN')}đ`, description: s.description, icon: BriefcaseMedical }));
  };

  const getDoctorOptions = () => {
    if (doctorDisabled && preselectedDoctorId) {
      const found = doctors.find(d => d.staffId === preselectedDoctorId);
      if (found) return [{ value: String(found.staffId), label: found.fullName, description: found.description, icon: Stethoscope }];
      if (loading.doctor) return [{ value: String(preselectedDoctorId), label: 'Đang tải...', icon: Stethoscope }];
      return [{ value: String(preselectedDoctorId), label: 'Không tìm thấy bác sĩ', icon: Stethoscope }];
    }
    return [
      { value: 'none', label: 'Sắp xếp bác sĩ ngẫu nhiên' },
      ...doctors.map(d => ({ value: String(d.staffId), label: d.fullName, description: d.description, icon: Stethoscope })),
    ];
  };

  return (
    <div className="flex flex-col gap-8">
  
      <div className="flex flex-col gap-7">
        {showExpertise && (
          <FormSearchModal
            label="Chuyên khoa"
            triggerIcon={Activity}
            modalTitle="Chọn Chuyên khoa"
            value={String(formData.expertiseId)}
            disabled={expertiseDisabled}
            placeholder="Chọn chuyên khoa"
            onChange={(val) => updateFormData({ expertiseId: Number(val), doctorId: '', timeStart: '', timeEnd: '' })}
            options={getExpertiseOptions()}
          />
        )}

        {showService && (
          <FormSearchModal
            label="Dịch vụ"
            triggerIcon={BriefcaseMedical}
            modalTitle="Chọn Dịch vụ"
            value={String(formData.serviceId)}
            disabled={serviceDisabled}
            placeholder="Chọn dịch vụ"
            onChange={(val) => updateFormData({ serviceId: Number(val) })}
            options={getServiceOptions()}
          />
        )}

        {showDoctor && (
          <FormSearchModal
            label="Bác sĩ"
            triggerIcon={Stethoscope}
            modalTitle="Chọn Bác sĩ"
            value={String(formData.doctorId)}
            disabled={doctorDisabled}
            placeholder="Chọn bác sĩ hoặc để trống"
            onChange={(val) => updateFormData({ doctorId: val === 'none' ? '' : Number(val), timeStart: '', timeEnd: '' })}
            options={getDoctorOptions()}
          />
        )}

        <TimeSlotPicker formData={formData} updateForm={updateFormData} dates={dates} timeSlots={timeSlots} />

        <FormTextarea
          label="Triệu chứng / Lý do khám"
          required
          value={formData.description}
          onChange={(value) => updateFormData({ description: value })}
          placeholder="Mô tả triệu chứng của bạn..."
        />
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="cursor-pointer bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl h-12 px-12 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Xác nhận đặt lịch
        </button>
      </div>
    </div>
  );
};