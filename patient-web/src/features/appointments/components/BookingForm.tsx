import React, { useCallback, useEffect, useState } from 'react';
import { Activity, Stethoscope, BriefcaseMedical } from 'lucide-react';
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

  // QUY TẮC HIỂN THỊ (đã sửa)
  const showExpertise = !isServiceBooking && mode !== 'service';
  const showDoctor = !isServiceBooking && mode !== 'service';   // 👈 bỏ !isDoctorBooking
  const showService = isServiceBooking || mode === 'service';

  const expertiseDisabled = isDoctorBooking || isExpertiseBooking;
  const doctorDisabled = isDoctorBooking;
  const serviceDisabled = isServiceBooking;

  // 1. Fetch danh mục chính
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
        toast({ title: 'Error', description: 'Failed to load booking data', variant: 'destructive' });
      }
    };
    fetchInitial();
  }, [toast]);

  // 2. Nếu có doctorId: lấy thông tin bác sĩ, set expertise và cập nhật danh sách doctors
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
        // Lấy danh sách bác sĩ theo chuyên khoa (để dropdown hiển thị đúng tên)
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

  // 3. Nếu có expertiseId (không có doctorId): lấy danh sách bác sĩ theo chuyên khoa
  useEffect(() => {
    if (!preselectedExpertiseId || preselectedDoctorId) return;
    appointmentApi.getDoctorsByExpertise(preselectedExpertiseId)
      .then(setDoctors)
      .catch(console.error);
  }, [preselectedExpertiseId, preselectedDoctorId]);

  // 4. Khi người dùng thay đổi chuyên khoa (nếu không bị disable và không phải doctor booking)
  useEffect(() => {
    if (!formData.expertiseId || expertiseDisabled || isDoctorBooking) return;
    appointmentApi.getDoctorsByExpertise(Number(formData.expertiseId))
      .then(setDoctors)
      .catch(console.error);
  }, [formData.expertiseId, expertiseDisabled, isDoctorBooking]);

  // 5. Lấy khung giờ
  useEffect(() => {
    if (!formData.appointmentDate || !formData.doctorId) {
      setTimeSlots([]);
      return;
    }
    appointmentApi.getTimeSlots(formData.appointmentDate, Number(formData.doctorId))
      .then(setTimeSlots)
      .catch(console.error);
  }, [formData.appointmentDate, formData.doctorId]);

  const updateFormData = useCallback((data: Partial<BookingFormState>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  const handleSubmit = async () => {
    if (!formData.appointmentDate || !formData.timeStart || !formData.description.trim()) {
      toast({ title: 'Missing info', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    try {
      const result = await appointmentApi.createAppointment(formData);
      if (result.success) {
        onSubmit(formData);
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to create appointment', variant: 'destructive' });
    }
  };

  const isFormValid = Boolean(formData.appointmentDate && formData.timeStart && formData.description.trim());

  // Helper để hiển thị đúng label khi field bị disabled
  const getExpertiseOptions = () => {
    if (expertiseDisabled && formData.expertiseId) {
      const found = expertises.find(e => e.expertiseId === Number(formData.expertiseId));
      if (found) return [{ value: String(found.expertiseId), label: found.expertiseName, icon: Activity }];
      if (loading.doctor) return [{ value: String(formData.expertiseId), label: 'Loading...', icon: Activity }];
    }
    return expertises.map(e => ({ value: String(e.expertiseId), label: e.expertiseName, description: e.description, icon: Activity }));
  };

  const getServiceOptions = () => {
    if (serviceDisabled && preselectedServiceId) {
      const found = services.find(s => s.serviceId === preselectedServiceId);
      if (found) return [{ value: String(found.serviceId), label: found.serviceName, description: found.description, icon: BriefcaseMedical }];
      return [{ value: String(preselectedServiceId), label: 'Loading...', icon: BriefcaseMedical }];
    }
    return services.map(s => ({ value: String(s.serviceId), label: `${s.serviceName} - ${s.price.toLocaleString('vi-VN')}đ`, description: s.description, icon: BriefcaseMedical }));
  };

  const getDoctorOptions = () => {
    if (doctorDisabled && preselectedDoctorId) {
      const found = doctors.find(d => d.staffId === preselectedDoctorId);
      if (found) return [{ value: String(found.staffId), label: found.fullName, description: found.description, icon: Stethoscope }];
      if (loading.doctor) return [{ value: String(preselectedDoctorId), label: 'Loading...', icon: Stethoscope }];
      return [{ value: String(preselectedDoctorId), label: 'Doctor not found', icon: Stethoscope }];
    }
    return [
      { value: 'none', label: 'Auto assign doctor' },
      ...doctors.map(d => ({ value: String(d.staffId), label: d.fullName, description: d.description, icon: Stethoscope })),
    ];
  };

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-2xl font-black text-brand-dark text-center">
        {isDoctorBooking ? 'Doctor Consultation' : isServiceBooking ? 'Service Booking' : 'Book Appointment'}
      </h2>

      <div className="flex flex-col gap-7">
        {showExpertise && (
          <FormSearchModal
            label="Specialty"
            triggerIcon={Activity}
            modalTitle="Select Specialty"
            value={String(formData.expertiseId)}
            disabled={expertiseDisabled}
            placeholder="Select specialty"
            onChange={(val) => updateFormData({ expertiseId: Number(val), doctorId: '', timeStart: '', timeEnd: '' })}
            options={getExpertiseOptions()}
          />
        )}

        {showService && (
          <FormSearchModal
            label="Service"
            triggerIcon={BriefcaseMedical}
            modalTitle="Select Service"
            value={String(formData.serviceId)}
            disabled={serviceDisabled}
            placeholder="Select service"
            onChange={(val) => updateFormData({ serviceId: Number(val) })}
            options={getServiceOptions()}
          />
        )}

        {showDoctor && (
          <FormSearchModal
            label="Doctor"
            triggerIcon={Stethoscope}
            modalTitle="Select Doctor"
            value={String(formData.doctorId)}
            disabled={doctorDisabled}
            placeholder="Choose doctor or leave empty"
            onChange={(val) => updateFormData({ doctorId: val === 'none' ? '' : Number(val), timeStart: '', timeEnd: '' })}
            options={getDoctorOptions()}
          />
        )}

        <TimeSlotPicker formData={formData} updateForm={updateFormData} dates={dates} timeSlots={timeSlots} />

        <FormTextarea
          label="Symptoms / Medical condition"
          required
          value={formData.description}
          onChange={(value) => updateFormData({ description: value })}
          placeholder="Describe your symptoms..."
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="cursor-pointer bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl h-12 px-12 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};