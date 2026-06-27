// src/features/home/components/HowItWorks.tsx
import React from 'react';
import { Building2, CircleDollarSign } from 'lucide-react';
import { CarouselWrapper, SectionContainer, SectionHeader, ViewAllButton, ActionButton } from '@/components/common';
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
    /*
      Nhận từ FeaturedDoctors: kết thúc white
      Bắt đầu white → gradient-white-blue → gradient-blue
      → Kết thúc gradient-blue (#e0f2fe) trước Footer
    */
    <section className="py-14 bg-gradient-to-b from-white via-gradient-white-blue to-gradient-blue">
      <SectionContainer className="relative max-w-[1140px]">
        <SectionHeader title="Chăm sóc sức khỏe toàn diện" />
        <CarouselWrapper>
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={`skel-srv-${i}`} className="w-[265px] min-w-[265px] max-w-[265px] shrink-0 snap-start bg-white rounded-[24px] overflow-hidden shadow-sm border border-slate-100 flex flex-col animate-pulse">
                <div className="w-full h-[160px] bg-slate-200"></div>
                <div className="p-5 flex flex-col flex-1 gap-3">
                  <div className="h-5 bg-slate-200 rounded w-full"></div>
                  <div className="h-5 bg-slate-200 rounded w-2/3"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/2 mt-2"></div>
                  <div className="h-6 bg-slate-200 rounded w-3/4 mt-auto"></div>
                  <div className="h-11 bg-slate-200 rounded-xl w-full mt-2"></div>
                </div>
              </div>
            ))
          ) : (
            services.filter(s => s.serviceType === 'LAB_TEST' || s.serviceType === 'X_RAY').slice(0, 8).map((service) => {
              const hasDiscount = service.discountPrice && service.originalPrice && service.discountPrice < service.originalPrice;
              const discountPercent = hasDiscount 
                ? Math.round((1 - service.discountPrice! / service.originalPrice!) * 100) 
                : 0;

              return (
                <div
                  key={service.serviceId}
                  onClick={() => handleServiceClick(service.serviceId)}
                  className="cursor-pointer w-[265px] min-w-[265px] max-w-[265px] shrink-0 snap-start bg-white rounded-[24px] overflow-hidden shadow-lg shadow-slate-200/40 border border-slate-200/80 flex flex-col hover:shadow-2xl hover:shadow-primary-500/20 hover:border-primary-300 hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="w-full h-[160px] overflow-hidden bg-slate-50 relative">
                    <ImageWithFallback
                      src={`${staticUrl}${service.imageUrl}`}
                      alt={service.serviceName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      containerClassName="absolute inset-0 w-full h-full"
                    />
                    {hasDiscount && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-[12px] font-black px-2.5 py-1 rounded-full shadow-md z-10">
                        -{discountPercent}%
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-brand-dark text-[16px] leading-snug line-clamp-2 mb-2 min-h-[44px] group-hover:text-primary-600 transition-colors">
                      {service.serviceName}
                    </h3>
                    {service.description && (
                      <p className="text-slate-500 text-[12px] leading-relaxed line-clamp-2 mb-3">
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
                            <span className="text-brand-dark font-bold text-[15px] leading-none">
                              {formatPrice(service.originalPrice || 0)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ActionButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleServiceClick(service.serviceId);
                      }}
                      className="mt-4 h-[42px] px-6 text-[14px] font-bold rounded-xl shadow-md shadow-primary-500/20 group-hover:shadow-lg transition-all"
                    >
                      Đặt khám ngay
                    </ActionButton>
                  </div>
                </div>
              );
            })
          )}
        </CarouselWrapper>
        <div className="text-center mt-8">
          <ViewAllButton onClick={handleViewAll} />
        </div>
      </SectionContainer>
    </section>
  );
};