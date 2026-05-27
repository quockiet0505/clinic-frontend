import React from 'react';
import { Star, User, Stethoscope, CircleDollarSign, Hospital } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CarouselWrapper, SectionContainer, SectionHeader, ViewAllButton } from '@/components/common';
import { getStaticUrl } from '@/utils/url';
import type { Doctor } from '../types/home';

interface Props {
  doctors: Doctor[];
}

export const FeaturedDoctors: React.FC<Props> = ({ doctors }) => {
  const staticUrl = getStaticUrl();

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
  const defaultConsultationFee = 200000; // tạm, sau lấy từ API

  return (
    <section className="py-14 bg-gradient-to-b from-gradient-blue via-gradient-white-cold to-white">
      <SectionContainer className="relative">
        <SectionHeader title="Bác sĩ tư vấn khám bệnh qua video" />
        <CarouselWrapper>
          {doctors.map((doctor, index) => (
            <div
            key={doctor.staffId}
            className="cursor-pointer min-w-[270px] max-w-[270px] shrink-0 snap-start bg-white rounded-xl shadow-md border border-slate-100 flex flex-col overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
              <div className="flex justify-center pt-6 pb-4">
                <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-100">
                  <img
                    src={`${staticUrl}${doctor.imageUrl}`}
                    alt={doctor.fullName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/default-avatar.png';
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center text-[12px] font-bold text-warning px-4 py-2 bg-primary-50">
                <div className="flex items-center gap-1">
                  <span className="text-brand-dark">Đánh giá:</span>
                  {defaultRating.toFixed(1)}
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-brand-dark">Lượt khám:</span>
                  {10 + index * 15}
                  <User className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col text-[13.5px] text-brand-dark">
                <div className="min-h-[72px]">
                  <p className="text-[14px]">BS.</p>
                  <h3 className="font-bold text-[18px] leading-tight mb-2">
                    {formatDoctorName(doctor.fullName)}
                  </h3>
                </div>
                <div className="flex items-center gap-2 min-h-[24px] mb-2">
                  <Stethoscope className="w-[18px] h-[18px] text-slate-500 shrink-0" />
                  <span className="line-clamp-1 text-slate-600">
                    {doctor.expertise?.expertiseName || 'Chuyên khoa tổng quát'}
                  </span>
                </div>
                <div className="flex items-center gap-2 min-h-[24px] mb-2">
                  <CircleDollarSign className="w-[18px] h-[18px] text-slate-500 shrink-0" />
                  <span className="text-slate-600">{formatPrice(defaultConsultationFee)}</span>
                </div>
                <div className="flex items-center gap-2 min-h-[24px]">
                  <Hospital className="w-[18px] h-[18px] text-slate-500 shrink-0" />
                  <span className="line-clamp-1 text-slate-600">Bác sĩ chuyên khoa</span>
                </div>
                <Button className="w-full mt-auto bg-primary-500 hover:bg-primary-600 text-white rounded-xl h-[42px] font-bold">
                  Tư vấn ngay
                </Button>
              </div>
            </div>
          ))}
        </CarouselWrapper>
        <div className="text-center mt-6">
          <ViewAllButton />
        </div>
      </SectionContainer>
    </section>
  );
};