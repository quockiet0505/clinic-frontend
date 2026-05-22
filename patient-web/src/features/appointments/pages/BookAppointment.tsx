import React, { useEffect, useState } from 'react';
import { ShieldCheck, MapPin, AlertCircle, Clock, Ban, Info, Activity, Stethoscope, BriefcaseMedical } from 'lucide-react';
import { Button } from '@/components/ui/button';

// IMPORT COMPONENT MỚI VÀO ĐÂY
import { FormSearchModal } from '@/components/common/FormSearchModal'; 
import { FormTextarea, StepIndicator, SectionContainer } from '@/components/common';
import { appointmentApi } from '../api/appointmentApi';
import { TimeSlotPicker } from '../components/TimeSlotPicker';
import type { BookingFormState, AvailableDate, Doctor, Expertise, Service, TimeSlot } from '../types/appointment';

export const BookAppointment: React.FC = () => {
  // ... (Giữ nguyên các State và useEffect ở trên y hệt bản cũ) ...
  const [currentStep, setCurrentStep] = useState(1);
  const [expertises, setExpertises] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [dates, setDates] = useState<AvailableDate[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [formData, setFormData] = useState<BookingFormState>({ expertiseId: '', serviceId: '', doctorId: '', appointmentDate: '', timeStart: '', timeEnd: '', description: '' });

  useEffect(() => { appointmentApi.getExpertises().then(setExpertises); appointmentApi.getServices().then(setServices); appointmentApi.getAvailableDates().then(setDates); }, []);
  useEffect(() => { if (formData.expertiseId) { appointmentApi.getDoctorsByExpertise(Number(formData.expertiseId)).then(setDoctors); } else setDoctors([]); }, [formData.expertiseId]);
  useEffect(() => { if (formData.appointmentDate) { appointmentApi.getTimeSlots(formData.appointmentDate, Number(formData.doctorId)).then(setTimeSlots); } else setTimeSlots([]); }, [formData.appointmentDate, formData.doctorId]);

  const updateFormData = (data: Partial<BookingFormState>) => setFormData((prev) => ({ ...prev, ...data }));
  const isStep1Valid = Boolean(formData.expertiseId && formData.appointmentDate && formData.timeStart && formData.description.trim());

  return (
    <main className="w-full min-h-screen bg-[#f5f7f9] py-10">
      <SectionContainer className="max-w-6xl flex flex-col lg:flex-row gap-8 items-start">
        {/* ... (Cột TRÁI GIỮ NGUYÊN) ... */}
        <div className="w-full lg:w-[340px] flex flex-col gap-6 shrink-0 lg:sticky top-24">
          <div className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-[#00b5f1] px-5 py-4"><h3 className="text-[15px] font-bold text-white uppercase">Thông tin cơ sở y tế</h3></div>
            <div className="p-6">
              <h4 className="text-[16px] font-black text-[#003B5C] mb-3">Trung Tâm Mắt Quốc Tế Phương Đông</h4>
              <p className="text-[13px] text-slate-500 leading-relaxed"><MapPin className="inline h-4 w-4 mr-1"/> 71-73 Ngô Thời Nhiệm, Phường Võ Thị Sáu, Q3, HCM</p>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: Sử dụng FormSearchModal */}
        <div className="flex-1 w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <StepIndicator currentStep={currentStep} />

          <div className="p-6 md:p-10 flex-1 min-h-[600px]">
            {currentStep === 1 && (
              <div className="flex flex-col gap-8">
                <h2 className="text-[22px] font-black text-[#003B5C] text-center mb-2">Chọn thông tin khám</h2>

                <div className="flex flex-col gap-7">
                  {/* SỬ DỤNG FormSearchModal MỚI */}
                  <FormSearchModal
                    label="Chuyên khoa"
                    required
                    triggerIcon={Activity}
                    modalTitle="Chọn chuyên khoa"
                    value={String(formData.expertiseId)}
                    onChange={(val) => updateFormData({ expertiseId: Number(val), doctorId: '', timeStart: '', timeEnd: '' })}
                    placeholder="Chọn chuyên khoa"
                    options={expertises.map(i => ({ value: String(i.id), label: i.name, description: i.description, icon: Activity }))}
                  />

                  <FormSearchModal
                    label="Dịch vụ đi kèm (Tùy chọn)"
                    triggerIcon={BriefcaseMedical}
                    modalTitle="Chọn dịch vụ"
                    value={String(formData.serviceId)}
                    onChange={(val) => updateFormData({ serviceId: val === 'none' ? '' : Number(val) })}
                    placeholder="Không chọn dịch vụ"
                    options={[
                      { value: 'none', label: 'Không chọn dịch vụ' }, 
                      ...services.map(i => ({ value: String(i.id), label: `${i.name} - ${i.price.toLocaleString('vi-VN')}đ`, description: i.description, icon: BriefcaseMedical }))
                    ]}
                  />

                  <FormSearchModal
                    label="Bác sĩ (Tùy chọn)"
                    triggerIcon={Stethoscope}
                    modalTitle="Chọn Bác sĩ"
                    disabled={!formData.expertiseId}
                    value={String(formData.doctorId)}
                    onChange={(val) => updateFormData({ doctorId: val === 'none' ? '' : Number(val), timeStart: '', timeEnd: '' })}
                    placeholder="Hệ thống tự động sắp xếp bác sĩ"
                    options={[
                      { value: 'none', label: 'Hệ thống tự động sắp xếp bác sĩ' }, 
                      ...doctors.map(i => ({ value: String(i.id), label: i.fullName, description: i.description, icon: Stethoscope }))
                    ]}
                  />

                  <TimeSlotPicker formData={formData} updateForm={updateFormData} dates={dates} timeSlots={timeSlots} />

                  <FormTextarea label="Triệu chứng / Tình trạng bệnh" required value={formData.description} onChange={(val) => updateFormData({ description: val })} placeholder="Mô tả ngắn gọn triệu chứng..." />
                </div>
              </div>
            )}
          </div>
          
          <div className="border-t border-slate-100 bg-slate-50 p-6 md:px-10 flex justify-end">
            <Button onClick={() => setCurrentStep(2)} disabled={!isStep1Valid} className="bg-[#00b5f1] hover:bg-[#0098cc] text-white font-bold rounded-xl h-12 px-12 shadow-md">Tiếp tục</Button>
          </div>
        </div>
      </SectionContainer>
    </main>
  );
};