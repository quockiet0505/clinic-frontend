// src/features/home/components/HowItWorks.tsx
import React from 'react';
import { Building2, CircleDollarSign } from 'lucide-react';
import { CarouselWrapper, SectionContainer, SectionHeader, ViewAllButton, ActionButton } from '@/components/common';
import { getStaticUrl } from '@/utils/url';
import { useNavigate } from 'react-router-dom';
import type { ServicePackage } from '../types/home';

interface Props {
  services: ServicePackage[];
}

export const HowItWorks: React.FC<Props> = ({ services }) => {
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
      <SectionContainer className="relative">
        <SectionHeader title="Chăm sóc sức khỏe toàn diện" />
        <CarouselWrapper>
          {services.slice(0, 8).map((service) => (
            <div
              key={service.serviceId}
              onClick={() => handleServiceClick(service.serviceId)}
              className="cursor-pointer min-w-[270px] max-w-[270px] shrink-0 snap-start bg-white rounded-xl overflow-hidden shadow-md border border-slate-100 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-full h-[160px] overflow-hidden bg-slate-50">
                <img
                  src={`${staticUrl}${service.imageUrl}`}
                  alt={service.serviceName}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  onError={(e) => (e.currentTarget.src = '/images/services/default.jpg')}
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-brand-dark text-[15px] leading-snug line-clamp-2 mb-3 min-h-[44px]">
                  {service.serviceName}
                </h3>
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-1.5 text-[13px] min-h-[42px]">
                    <Building2 className="w-[18px] h-[18px] text-slate-500 shrink-0" />
                    <span className="line-clamp-2 text-slate-600">ClinicPro</span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px]">
                    <CircleDollarSign className="w-[18px] h-[18px] text-slate-500" />
                    <span className="text-warning font-bold text-[15px]">
                      {formatPrice(service.discountPrice || service.price)}
                    </span>
                    {service.discountPrice && service.discountPrice < service.price && (
                      <span className="text-slate-400 line-through">{formatPrice(service.price)}</span>
                    )}
                  </div>
                </div>
                <ActionButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleServiceClick(service.serviceId);
                  }}
                  className="mt-4 h-11 px-6 text-sm"
                >
                  Đặt khám ngay
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