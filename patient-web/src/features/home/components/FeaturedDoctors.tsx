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
}

export const FeaturedDoctors: React.FC<Props> = ({ doctors }) => {
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

  const defaultRating = 4.5;

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
    <section id="featured-doctors-section" className="py-14 bg-gradient-to-b from-gradient-blue via-gradient-white-cold to-white">
      <SectionContainer className="relative">
        <SectionHeader title="Bác sĩ tư vấn khám bệnh qua video" />
        <CarouselWrapper>
          {doctors.map((doctor, index) => (
            <div
              key={doctor.staffId}
              onClick={() => handleDoctorClick(doctor.staffId)}
              className="cursor-pointer min-w-[270px] max-w-[270px] shrink-0 snap-start bg-white rounded-xl shadow-md border border-slate-100 flex flex-col overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex justify-center pt-6 pb-4">
                <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-100 relative">
                  <ImageWithFallback
                    src={`${staticUrl}${doctor.imageUrl}`}
                    alt={doctor.fullName}
                    className="w-full h-full object-cover"
                    containerClassName="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-warning px-4 py-2 bg-primary-50">
                <div className="flex items-center gap-1">
                  <span className="text-brand-dark">Đánh giá:</span> {defaultRating.toFixed(1)}
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-brand-dark">Lượt khám:</span> {10 + index * 15}
                  <User className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col text-brand-dark">
                <div className="min-h-[72px]">
                  <p className="text-sm">BS.</p>
                  <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2" title={formatDoctorName(doctor.fullName)}>{formatDoctorName(doctor.fullName)}</h3>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Stethoscope className="w-[18px] h-[18px] text-slate-500 shrink-0" />
                  <span className="line-clamp-1 text-slate-600" title={doctor.expertiseName || 'Chuyên khoa tổng quát'}>
                    {doctor.expertiseName || 'Chuyên khoa tổng quát'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Hospital className="w-[18px] h-[18px] text-slate-500 shrink-0" />
                  <span className="line-clamp-1 text-slate-600" title={doctor.experience || 'Nhiều năm kinh nghiệm'}>
                    Kinh nghiệm: {doctor.experience || 'Nhiều năm'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CircleDollarSign className="w-[18px] h-[18px] text-slate-500 shrink-0" />
                  <span className="text-slate-600">Từ {formatPrice(200000)}</span>
                </div>
                <ActionButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDoctorClick(doctor.staffId);
                  }}
                  className="mt-4 h-11 px-6 text-sm"
                >
                  Tư vấn ngay
                </ActionButton>
              </div>
            </div>
          ))}
        </CarouselWrapper>
        <div className="text-center mt-6">
          <ViewAllButton onClick={handleViewAll} />
        </div>
      </SectionContainer>
    </section>
  );
};