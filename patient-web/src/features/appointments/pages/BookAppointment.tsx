import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { SectionContainer } from '@/components/common';
import { BookingForm } from '../components/BookingForm';
import { useToast } from '@/hooks/useToast';

export const BookAppointment: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const doctorId = Number(searchParams.get('doctorId')) || undefined;
  const expertiseId = Number(searchParams.get('expertiseId')) || undefined;
  const serviceId = Number(searchParams.get('serviceId')) || undefined;

  const mode = searchParams.get('mode');

  const isDoctorBooking = !!doctorId;
  const isExpertiseBooking = !!expertiseId;
  const isServiceBooking = !!serviceId;

  const bookingMode =
    mode === 'service'
      ? 'service'
      : 'doctor';

  const handleSubmit = () => {
    toast({
      title: 'Success',
      description: 'Appointment request submitted',
    });

    navigate('/appointments/my');
  };

  console.log({
    doctorId,
    expertiseId,
    serviceId,
  });

  return (
    
    <main className="w-full min-h-screen bg-background-light py-10">
      <SectionContainer className="max-w-6xl flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-[340px] flex flex-col gap-6 shrink-0 lg:sticky top-24">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-primary-500 px-5 py-4">
              <h3 className="text-sm font-bold text-white uppercase">
                Medical Facility Info
              </h3>
            </div>

            <div className="p-6">
              <h4 className="text-base font-black text-brand-dark mb-3">
                Phuong Dong International Eye Center
              </h4>

              <p className="text-sm text-slate-500 leading-relaxed">
                <MapPin className="inline h-4 w-4 mr-1" />
                71-73 Ngo Thoi Nhiem, Vo Thi Sau Ward,
                District 3, HCMC
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-10">
          <BookingForm
            preselectedExpertiseId={expertiseId}
            preselectedDoctorId={doctorId}
            preselectedServiceId={serviceId}
            isDoctorBooking={isDoctorBooking}
            isExpertiseBooking={isExpertiseBooking}
            isServiceBooking={isServiceBooking}
            mode={bookingMode}
            onSubmit={handleSubmit}
          />
        </div>
      </SectionContainer>
    </main>
  );
};