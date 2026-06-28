// src/features/home/components/FeaturedDoctors.tsx
import React from 'react';
import { Star, User, Stethoscope, CircleDollarSign, Hospital } from 'lucide-react';
import { CarouselWrapper, SectionContainer, SectionHeader, ViewAllButton } from '@/components/common';
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

  const splitDoctorName = (raw: string): { prefix: string; name: string } => {
    if (!raw) return { prefix: 'Bác sĩ', name: '' };
    const cleaned = raw.replace(/^[.•\s]+/, '').trim();
    const prefixRe = /^(BS\.?CKII\.?|BS\.?CKI\.?|ThS\.?BS\.?|ThS\.?CKI\.?BSNT\.?|TS\.?BS\.?|BS\.?|Bác sĩ)\s*/i;
    const m = cleaned.match(prefixRe);
    if (m) {
      const prefix = m[1].replace(/\./g, '').trim();
      const name = cleaned.slice(m[0].length).replace(/^[.•\s]+/, '').trim();
      return { prefix: prefix || 'Bác sĩ', name };
    }
    return { prefix: 'Bác sĩ', name: cleaned };
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
    <section id="featured-doctors-section" className="py-14 bg-[#f4f9fd]">
      <SectionContainer className="relative max-w-[1280px]">
        {/* Tiêu đề */}
        <h2 className="text-[24px] md:text-[28px] font-bold text-[#0F3B63] text-center mb-10 uppercase">
          BÁC SĨ TƯ VẤN KHÁM BỆNH
        </h2>
        
        <CarouselWrapper>
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={`skel-${i}`} className="w-full h-full bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden animate-pulse">
                <div className="flex justify-center pt-6 pb-4">
                  <div className="w-[120px] h-[120px] rounded-full bg-slate-200"></div>
                </div>
                <div className="h-9 bg-[#f0f9ff] w-full mb-2"></div>
                <div className="p-5 flex-1 flex flex-col gap-3">
                  <div className="h-5 bg-slate-200 rounded w-3/4 mb-1"></div>
                  <div className="h-4 bg-slate-100 rounded w-full"></div>
                  <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                  <div className="h-10 bg-[#00b5f1] rounded-lg w-full mt-auto"></div>
                </div>
              </div>
            ))
          ) : (
            doctors.map((doctor) => {
              const { prefix, name } = splitDoctorName(doctor.fullName);
              const description = doctor.specialtyTreatment ? doctor.specialtyTreatment.replace(/^[.•\s]+/, '').trim() : null;

              return (
                <div
                  key={doctor.staffId}
                  onClick={() => handleDoctorClick(doctor.staffId)}
                  className="cursor-pointer w-full h-full bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#e8f1f8] flex flex-col overflow-hidden hover:border-[#00b5f1] hover:shadow-[0_6px_20px_rgba(0,181,241,0.15)] hover:-translate-y-1 transition-all duration-300 group"
                >
                  {/* Avatar */}
                  <div className="flex justify-center pt-6 pb-5">
                    <div className="w-[120px] h-[120px] rounded-full overflow-hidden bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] group-hover:shadow-md transition-shadow">
                      <ImageWithFallback
                        src={`${staticUrl}${doctor.imageUrl}`}
                        alt={name}
                        className="w-full h-full object-cover"
                        containerClassName="w-full h-full"
                      />
                    </div>
                  </div>

                  {/* Stats Bar */}
                  <div className="flex justify-between items-center text-[13px] font-medium text-[#1e3a8a] px-4 py-2.5 bg-[#f0f9ff] group-hover:bg-[#e0f2fe] transition-colors">
                    <div className="flex items-center gap-1.5">
                      <span>Đánh giá:</span>
                      <span className="text-[#f59e0b] font-bold">{doctor.rating?.toFixed(1) || '5.0'}</span>
                      <Star className="w-[15px] h-[15px] text-[#f59e0b] fill-[#f59e0b]" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>Lượt khám:</span>
                      <span className="text-[#f59e0b] font-bold">{doctor.patientCount || 0}</span>
                      <User className="w-[15px] h-[15px] text-[#f59e0b] fill-[#f59e0b]" />
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="px-5 pt-4 pb-5 flex-1 flex flex-col text-[#334155]">
                    {/* Tên bác sĩ */}
                    <div className="mb-2.5">
                      <h3 className="font-bold text-[19px] text-[#0F3B63] leading-snug line-clamp-2 text-wrap-balance group-hover:text-[#00AEEF] transition-colors" title={`${prefix} ${name}`}>
                        <span className="font-medium text-[16px] mr-1">{prefix}</span>
                        {name}
                      </h3>
                    </div>
                    
                    {/* Danh sách icon thông tin */}
                    <div className="flex flex-col gap-2.5 mb-3 text-[14.5px]">
                      {/* Chuyên khoa */}
                      <div className="flex items-start gap-2.5">
                        <Stethoscope className="w-[18px] h-[18px] text-[#64748b] shrink-0 mt-0.5" />
                        <span className="line-clamp-1" title={doctor.expertiseName || 'Chuyên khoa tổng quát'}>
                          {doctor.expertiseName?.replace(/^[.•\s]+/, '').trim() || 'Chuyên khoa tổng quát'}
                        </span>
                      </div>
                      
                      {/* Giá khám */}
                      <div className="flex items-start gap-2.5">
                        <CircleDollarSign className="w-[18px] h-[18px] text-[#64748b] shrink-0 mt-0.5" />
                        <span className="line-clamp-1 text-[#334155] font-semibold">
                          {formatPrice(doctor.consultationFee || 0)}
                        </span>
                      </div>
                      
                      {/* Bác sĩ chuyên khoa / Kinh nghiệm */}
                      <div className="flex items-start gap-2.5">
                        <Hospital className="w-[18px] h-[18px] text-[#64748b] shrink-0 mt-0.5" />
                        <span className="line-clamp-1" title={doctor.experience || 'Bác sĩ Chuyên Khoa'}>
                          {doctor.experience || 'Bác sĩ Chuyên Khoa'}
                        </span>
                      </div>
                    </div>

                    {/* Mô tả (nếu có) */}
                    {description && (
                      <div className="text-[14px] text-[#64748b] leading-relaxed line-clamp-2 mb-3 mt-1.5 text-wrap-balance">
                        {description}
                      </div>
                    )}

                    {/* Button */}
                    <div className="mt-auto pt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDoctorClick(doctor.staffId);
                        }}
                        className="w-full h-[46px] bg-[#00b5f1] text-white text-[16px] font-bold rounded-lg border-2 border-transparent hover:bg-white hover:text-[#00b5f1] hover:border-[#00b5f1] transition-all duration-300 cursor-pointer"
                      >
                        Tư vấn ngay
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </CarouselWrapper>
        <div className="text-center mt-6">
          <ViewAllButton onClick={handleViewAll} />
        </div>
      </SectionContainer>
    </section>
  );
};