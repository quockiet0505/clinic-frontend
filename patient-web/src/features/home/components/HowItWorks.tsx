// src/features/home/components/HowItWorks.tsx
import React from 'react';
import { isPatientBookableService } from '@/constants/serviceTypes';
import { CircleDollarSign } from 'lucide-react';
import { CarouselWrapper, SectionContainer, SectionHeader, ViewAllButton } from '@/components/common';
import { getStaticUrl } from '@/utils/url';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import type { ServicePackage } from '../types/home';

interface Props {
  services: ServicePackage[];
  isLoading?: boolean;
}

export const HowItWorks: React.FC<Props> = ({ services, isLoading }) => {
  const staticUrl = getStaticUrl();
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleServiceClick = (serviceId: number) => {
    navigate(`/appointments/book?serviceId=${serviceId}`);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleViewAll = () => {
    navigate('/services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-14 bg-gradient-to-b from-white via-gradient-white-blue to-gradient-blue">
      <SectionContainer className="relative max-w-[1280px]">
        {/* Tiêu đề cập nhật font to hơn một chút */}
        <h2 className="text-[24px] md:text-[28px] font-bold text-[#0F3B63] text-center mb-10 uppercase">
          Chăm sóc sức khỏe toàn diện
        </h2>
        
        <CarouselWrapper>
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={`skel-srv-${i}`} className="w-full h-full bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 flex flex-col animate-pulse">
                <div className="w-full h-[180px] bg-slate-200"></div>
                <div className="p-5 flex flex-col flex-1 gap-3">
                  <div className="h-5 bg-slate-200 rounded w-full"></div>
                  <div className="h-5 bg-slate-200 rounded w-2/3"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/2 mt-2"></div>
                  <div className="h-14 bg-slate-50 rounded-xl w-full mt-auto"></div>
                  <div className="h-[46px] bg-[#00b5f1] rounded-lg w-full mt-2"></div>
                </div>
              </div>
            ))
          ) : (
            services.filter(s => isPatientBookableService(s.serviceType)).slice(0, 8).map((service) => {
              const hasDiscount = service.discountPrice && service.originalPrice && service.discountPrice < service.originalPrice;
              const discountPercent = hasDiscount 
                ? Math.round((1 - service.discountPrice! / service.originalPrice!) * 100) 
                : 0;

              return (
                <div
                  key={service.serviceId}
                  onClick={() => handleServiceClick(service.serviceId)}
                  className="cursor-pointer w-full h-full bg-white rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#e8f1f8] flex flex-col hover:border-[#00b5f1] hover:shadow-[0_6px_20px_rgba(0,181,241,0.15)] hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="w-full h-[180px] overflow-hidden bg-slate-50 relative border-b border-[#e8f1f8]">
                    <ImageWithFallback
                      src={`${staticUrl}${service.imageUrl}`}
                      alt={service.serviceName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      containerClassName="absolute inset-0 w-full h-full"
                    />
                    {hasDiscount && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-[13px] font-black px-3 py-1.5 rounded-full shadow-md z-10">
                        -{discountPercent}%
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1 text-[#334155]">
                    <h3 className="font-bold text-[#0F3B63] text-[18px] leading-snug line-clamp-2 mb-2 group-hover:text-[#00AEEF] transition-colors text-wrap-balance">
                      {service.serviceName}
                    </h3>
                    
                    {service.description && (
                      <p className="text-[#64748b] text-[14px] leading-relaxed line-clamp-2 mb-4 text-wrap-balance">
                        {service.description}
                      </p>
                    )}
                    
                    <div className="flex flex-col gap-2 mt-auto">
                      <div className="flex items-center gap-2 text-[13px] bg-slate-50 p-2.5 rounded-xl">
                        <CircleDollarSign className="w-[18px] h-[18px] text-slate-400 shrink-0" />
                        <div className="flex flex-col">
                          {hasDiscount ? (
                            <>
                              <span className="text-slate-400 line-through text-[11px] leading-none mb-0.5">{formatPrice(service.originalPrice!)}</span>
                              <span className="text-red-500 font-bold text-[15px] leading-none">
                                {formatPrice(service.discountPrice!)}
                              </span>
                            </>
                          ) : (
                            <span className="text-slate-700 font-bold text-[15px] leading-none">
                              {formatPrice(service.originalPrice || 0)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleServiceClick(service.serviceId);
                        }}
                        className="w-full h-[46px] bg-[#00b5f1] text-white text-[16px] font-bold rounded-lg border-2 border-transparent hover:bg-white hover:text-[#00b5f1] hover:border-[#00b5f1] transition-all duration-300 cursor-pointer"
                      >
                        Đặt khám ngay
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