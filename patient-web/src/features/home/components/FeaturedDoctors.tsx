// src/features/home/components/FeaturedDoctors.tsx
import React from 'react';
import { Star, User, Stethoscope, CircleDollarSign, Hospital } from 'lucide-react';
import { CarouselWrapper, SectionContainer, SectionHeader, ViewAllButton, ActionButton } from '@/components/common';
import { getStaticUrl } from '@/utils/url';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import type { Doctor } from '../types/home';

interface Props {
  doctors: Doctor[];
  isLoading?: boolean;
}

export const FeaturedDoctors: React.FC<Props> = ({ doctors, isLoading }) => {
  const staticUrl = getStaticUrl();
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDoctorName = (fullName: string) => {
    if (!fullName) return '';
    return fullName
      .replace(/^(BS CKII\.|BS CKI\.|BS\.|ThS BS\.|ThS CKI BSNT\.|TS BS\.)/, '')
      .trim();
  };

  const handleDoctorClick = (doctorId: number) => {
    navigate(`/appointments/book?doctorId=${doctorId}`);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleViewAll = () => {
    navigate('/doctors');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="featured-doctors-section" className="py-14 bg-gradient-to-b from-gradient-blue via-gradient-white-cold to-white border-y border-slate-200/50">
      <SectionContainer className="relative max-w-[1140px]">
        <SectionHeader title="Bác sĩ tư vấn khám bệnh" />
        <CarouselWrapper>
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={`skel-${i}`} className="w-[265px] min-w-[265px] max-w-[265px] shrink-0 snap-start bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col overflow-hidden animate-pulse">
                <div className="flex justify-center pt-6 pb-4">
                  <div className="w-28 h-28 rounded-full bg-slate-200"></div>
                </div>
                <div className="h-9 bg-slate-100 w-full mb-2"></div>
                <div className="p-5 flex-1 flex flex-col gap-3">
                  <div className="h-5 bg-slate-200 rounded w-3/4 mb-1"></div>
                  <div className="h-4 bg-slate-100 rounded w-full"></div>
                  <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                  <div className="h-10 bg-slate-200 rounded-xl w-full mt-auto"></div>
                </div>
              </div>
            ))
          ) : (
            doctors.map((doctor) => (
              <div
                key={doctor.staffId}
                onClick={() => handleDoctorClick(doctor.staffId)}
                className="cursor-pointer w-[265px] min-w-[265px] max-w-[265px] shrink-0 snap-start bg-white rounded-[24px] shadow-lg shadow-slate-200/40 border border-slate-200/80 flex flex-col overflow-hidden hover:shadow-2xl hover:shadow-primary-500/20 hover:border-primary-300 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex justify-center pt-6 pb-4 relative">
                  <div className="w-[130px] h-[130px] rounded-full overflow-hidden bg-gradient-to-br from-primary-50 to-[#eef5fa] relative border border-slate-100 group-hover:border-primary-200 transition-colors">
                    <ImageWithFallback
                      src={`${staticUrl}${doctor.imageUrl}`}
                      alt={doctor.fullName}
                      className="w-full h-full object-cover"
                      containerClassName="absolute inset-0 w-full h-full"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center text-[11px] uppercase tracking-wider font-bold text-slate-500 px-5 py-2.5 bg-slate-50 border-y border-slate-100 group-hover:bg-primary-50/50 group-hover:border-primary-100 transition-colors">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-normal normal-case">Đánh giá:</span>
                    <span className="text-brand-dark">{doctor.rating?.toFixed(1) || '5.0'}</span>
                    <Star className="w-[14px] h-[14px] text-amber-400 fill-amber-400" />
                  </div>
                  <div className="w-[1px] h-3 bg-slate-200"></div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-normal normal-case">Lượt khám:</span>
                    <span className="text-brand-dark">{doctor.patientCount || 0}</span>
                    <User className="w-[14px] h-[14px] text-primary-500" />
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col text-brand-dark">
                  <div className="min-h-[72px] mb-2">
                    <h3 className="font-bold text-[19px] leading-snug line-clamp-2 group-hover:text-primary-600 transition-colors" title={doctor.fullName}>
                      <span className="text-[14px] font-medium text-slate-500 block mb-0.5">Bác sĩ</span>
                      {formatDoctorName(doctor.fullName)}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2.5 mb-2.5 text-[14.5px]">
                    <Stethoscope className="w-[18px] h-[18px] text-primary-400 shrink-0" />
                    <span className="line-clamp-1 text-slate-600 font-medium" title={doctor.expertiseName || 'Chuyên khoa tổng quát'}>
                      {doctor.expertiseName || 'Chuyên khoa tổng quát'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 mb-2.5 text-[14.5px]">
                    <Hospital className="w-[18px] h-[18px] text-slate-400 shrink-0" />
                    <span className="line-clamp-1 text-slate-500" title={doctor.experience || 'Nhiều năm kinh nghiệm'}>
                      {doctor.experience || 'Nhiều năm kinh nghiệm'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[14.5px]">
                    <CircleDollarSign className="w-[18px] h-[18px] text-slate-400 shrink-0" />
                    <span className="text-slate-600">Từ <span className="font-bold text-brand-dark">{formatPrice(doctor.consultationFee || 0)}</span></span>
                  </div>
                  <ActionButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDoctorClick(doctor.staffId);
                    }}
                    className="mt-5 h-[42px] px-6 text-[14px] font-bold rounded-xl shadow-md shadow-primary-500/20 group-hover:shadow-lg transition-all"
                  >
                    Tư vấn ngay
                  </ActionButton>
                </div>
              </div>
            ))
          )}
        </CarouselWrapper>
        <div className="text-center mt-8">
          <ViewAllButton onClick={handleViewAll} />
        </div>
      </SectionContainer>
    </section>
  );
};