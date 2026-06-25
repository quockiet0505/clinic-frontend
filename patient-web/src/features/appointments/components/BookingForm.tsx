import React, { useCallback, useEffect, useState } from 'react';
import { Activity, Stethoscope, BriefcaseMedical, FileText, Sparkles } from 'lucide-react';
import { FormSearchModal, FormTextarea } from '@/components/common';
import { TimeSlotPicker } from './TimeSlotPicker';
import { appointmentApi } from '../api/appointmentApi';
import { useToast } from '@/hooks/useToast';
import type {
  BookingFormState,
  BookingMode,
  AvailableDate,
  Doctor,
  Expertise,
  Service,
  TimeSlot,
} from '../types/appointment';

interface BookingFormProps {
  preselectedExpertiseId?: number;
  preselectedDoctorId?: number;
  preselectedServiceId?: number;
  preselectedSuggestedExpertiseId?: number;
  isAiSuggested?: boolean;
  isDoctorBooking: boolean;
  isExpertiseBooking: boolean;
  isServiceBooking: boolean;
  mode?: 'doctor' | 'service';
  onSubmit: (data: BookingFormState) => void;
}

function resolveBookingMode(props: BookingFormProps): BookingMode {
  if (props.isDoctorBooking || props.preselectedDoctorId) return 'DOCTOR';
  if (props.isServiceBooking || props.preselectedServiceId || props.mode === 'service') return 'SERVICE';
  if (props.isExpertiseBooking || props.preselectedExpertiseId) return 'EXPERTISE';
  return 'DOCTOR';
}

export const BookingForm: React.FC<BookingFormProps> = (props) => {
  const {
    preselectedExpertiseId,
    preselectedDoctorId,
    preselectedServiceId,
    preselectedSuggestedExpertiseId,
    isAiSuggested,
    isDoctorBooking,
    isExpertiseBooking,
    isServiceBooking,
    mode,
    onSubmit,
  } = props;

  const initialBookingMode = resolveBookingMode(props);

  const [expertises, setExpertises] = useState<Expertise[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [dates, setDates] = useState<AvailableDate[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState({ doctor: false, service: false });
  const { toast } = useToast();

  const [formData, setFormData] = useState<BookingFormState>({
    bookingMode: initialBookingMode,
    expertiseId: preselectedExpertiseId ?? '',
    serviceId: preselectedServiceId ?? '',
    doctorId: preselectedDoctorId ?? '',
    appointmentDate: '',
    timeStart: '',
    timeEnd: '',
    description: '',
    suggestedExpertiseId: preselectedSuggestedExpertiseId ?? '',
    isAiSuggested: isAiSuggested ?? false,
  });

  const showExpertise = formData.bookingMode !== 'SERVICE';
  const showDoctor = formData.bookingMode === 'DOCTOR' || formData.bookingMode === 'EXPERTISE';
  const showService = formData.bookingMode === 'SERVICE';

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
          bookingMode: 'DOCTOR',
          doctorId: doctor.staffId,
          expertiseId: doctor.expertiseId ?? '',
        }));
        if (doctor.expertiseId) {
          return appointmentApi.getDoctorsByExpertise(doctor.expertiseId);
        }
        return [];
      })
      .then(doctorList => setDoctors(doctorList))
      .catch(console.error)
      .finally(() => setLoading(prev => ({ ...prev, doctor: false })));
  }, [preselectedDoctorId]);

  useEffect(() => {
    if (!preselectedExpertiseId || preselectedDoctorId) return;
    setFormData(prev => ({
      ...prev,
      bookingMode: 'EXPERTISE',
      expertiseId: preselectedExpertiseId,
    }));
    appointmentApi.getDoctorsByExpertise(preselectedExpertiseId)
      .then(setDoctors)
      .catch(console.error);
  }, [preselectedExpertiseId, preselectedDoctorId]);

  useEffect(() => {
    if (!preselectedServiceId) return;
    setFormData(prev => ({
      ...prev,
      bookingMode: 'SERVICE',
      serviceId: preselectedServiceId,
    }));
  }, [preselectedServiceId]);

  useEffect(() => {
    if (!formData.expertiseId || expertiseDisabled || isDoctorBooking) return;
    appointmentApi.getDoctorsByExpertise(Number(formData.expertiseId))
      .then(setDoctors)
      .catch(console.error);
  }, [formData.expertiseId, expertiseDisabled, isDoctorBooking]);

  useEffect(() => {
    if (!formData.appointmentDate) {
      setTimeSlots([]);
      return;
    }

    const loadSlots = async () => {
      try {
        if (formData.bookingMode === 'SERVICE' && formData.serviceId) {
          const slots = await appointmentApi.getTimeSlots(formData.appointmentDate, {
            serviceId: Number(formData.serviceId),
          });
          setTimeSlots(slots);
          return;
        }
        if (formData.doctorId) {
          const slots = await appointmentApi.getTimeSlots(formData.appointmentDate, {
            doctorId: Number(formData.doctorId),
          });
          setTimeSlots(slots);
          return;
        }
        if (formData.expertiseId) {
          const slots = await appointmentApi.getTimeSlots(formData.appointmentDate, {
            expertiseId: Number(formData.expertiseId),
          });
          setTimeSlots(slots);
          return;
        }
        setTimeSlots([]);
      } catch {
        setTimeSlots([]);
      }
    };

    loadSlots();
  }, [
    formData.appointmentDate,
    formData.doctorId,
    formData.expertiseId,
    formData.serviceId,
    formData.bookingMode,
  ]);

  const updateFormData = useCallback((data: Partial<BookingFormState>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  const handleSlotSelect = (slot: TimeSlot) => {
    updateFormData({
      timeStart: slot.timeStart,
      timeEnd: slot.timeEnd,
      ...(slot.doctorId && !formData.doctorId ? { doctorId: slot.doctorId } : {}),
    });
  };

  const handleSubmit = async () => {
    if (!formData.appointmentDate || !formData.timeStart || !formData.description.trim()) {
      toast({ title: 'Thiếu thông tin', description: 'Vui lòng điền đầy đủ các thông tin bắt buộc', variant: 'destructive' });
      return;
    }
    if (formData.bookingMode === 'DOCTOR' && !formData.doctorId) {
      toast({ title: 'Thiếu bác sĩ', description: 'Vui lòng chọn bác sĩ', variant: 'destructive' });
      return;
    }
    if (formData.bookingMode === 'EXPERTISE' && !formData.expertiseId) {
      toast({ title: 'Thiếu chuyên khoa', description: 'Vui lòng chọn chuyên khoa', variant: 'destructive' });
      return;
    }
    if (formData.bookingMode === 'SERVICE' && !formData.serviceId) {
      toast({ title: 'Thiếu dịch vụ', description: 'Vui lòng chọn dịch vụ', variant: 'destructive' });
      return;
    }
    try {
      await appointmentApi.createAppointment(formData);
      onSubmit(formData);
    } catch {
      /* toast: axios interceptor */
    }
  };

  const isFormValid = Boolean(
    formData.appointmentDate &&
    formData.timeStart &&
    formData.description.trim() &&
    (formData.bookingMode !== 'DOCTOR' || formData.doctorId) &&
    (formData.bookingMode !== 'EXPERTISE' || formData.expertiseId) &&
    (formData.bookingMode !== 'SERVICE' || formData.serviceId)
  );

  const getExpertiseOptions = () => {
    if (expertiseDisabled && formData.expertiseId) {
      const found = expertises.find(e => e.expertiseId === Number(formData.expertiseId));
      if (found) return [{ value: String(found.expertiseId), label: found.expertiseName, icon: Activity }];
      if (loading.doctor) return [{ value: String(formData.expertiseId), label: 'Đang tải...', icon: Activity }];
    }
    return expertises.map(e => ({
      value: String(e.expertiseId),
      label: e.expertiseName,
      description: e.description,
      icon: Activity,
    }));
  };

  const getServiceOptions = () => {
    if (serviceDisabled && preselectedServiceId) {
      const found = services.find(s => s.serviceId === preselectedServiceId);
      if (found) {
        return [{
          value: String(found.serviceId),
          label: found.serviceName,
          description: found.description,
          icon: BriefcaseMedical,
        }];
      }
      return [{ value: String(preselectedServiceId), label: 'Đang tải...', icon: BriefcaseMedical }];
    }
    return services.map(s => ({
      value: String(s.serviceId),
      label: `${s.serviceName} - ${s.price.toLocaleString('vi-VN')}đ`,
      description: s.description,
      icon: BriefcaseMedical,
    }));
  };

  const getDoctorOptions = () => {
    if (doctorDisabled && preselectedDoctorId) {
      const found = doctors.find(d => d.staffId === preselectedDoctorId);
      if (found) {
        return [{
          value: String(found.staffId),
          label: found.fullName,
          description: found.expertiseName,
          icon: Stethoscope,
        }];
      }
      if (loading.doctor) {
        return [{ value: String(preselectedDoctorId), label: 'Đang tải...', icon: Stethoscope }];
      }
      return [{ value: String(preselectedDoctorId), label: 'Không tìm thấy bác sĩ', icon: Stethoscope }];
    }
    return [
      { value: 'none', label: 'Để hệ thống chọn bác sĩ', icon: Stethoscope },
      ...(Array.isArray(doctors) ? doctors : []).map(d => ({
        value: String(d.staffId),
        label: d.fullName,
        description: d.expertiseName,
        icon: Stethoscope,
      })),
    ];
  };

  return (
    <div className="flex flex-col gap-8">
      {formData.isAiSuggested && formData.suggestedExpertiseId && (
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-violet-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-violet-900">Gợi ý từ Trợ lý AI</h4>
            <p className="text-xs text-violet-700 mt-1 leading-relaxed">
              Dựa trên triệu chứng của bạn, AI đã tự động chọn chuyên khoa phù hợp. Bạn có thể thay đổi nếu muốn.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-7">
        {showExpertise && (
          <FormSearchModal
            label="Chuyên khoa"
            triggerIcon={Activity}
            modalTitle="Chọn Chuyên khoa"
            value={String(formData.expertiseId)}
            disabled={expertiseDisabled}
            placeholder="Chọn chuyên khoa"
            onChange={(val) =>
              updateFormData({
                bookingMode: formData.bookingMode === 'SERVICE' ? 'SERVICE' : 'EXPERTISE',
                expertiseId: Number(val),
                doctorId: '',
                timeStart: '',
                timeEnd: '',
              })
            }
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
            onChange={(val) =>
              updateFormData({
                bookingMode: 'SERVICE',
                serviceId: Number(val),
                doctorId: '',
                timeStart: '',
                timeEnd: '',
              })
            }
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
            placeholder="Chọn bác sĩ hoặc để hệ thống chọn"
            onChange={(val) =>
              updateFormData({
                doctorId: val === 'none' ? '' : Number(val),
                bookingMode: formData.expertiseId && val === 'none' ? 'EXPERTISE' : 'DOCTOR',
                timeStart: '',
                timeEnd: '',
              })
            }
            options={getDoctorOptions()}
          />
        )}

        <TimeSlotPicker
          formData={formData}
          updateForm={updateFormData}
          dates={dates}
          timeSlots={timeSlots}
          onSlotSelect={handleSlotSelect}
        />

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
