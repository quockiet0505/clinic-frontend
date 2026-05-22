// src/features/home/components/HowItWorks.tsx

import React from 'react';

import {
  Building2,
  CircleDollarSign,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
  CarouselWrapper,
  SectionContainer,
  SectionHeader,
  ViewAllButton,
} from '@/components/common';

import { homeApi } from '@/features/home/api/homeApi';

export const HowItWorks: React.FC = () => {
  const services =
    homeApi.getHomeServices();

  const formatPrice = (
    price: number,
  ) => {
    return new Intl.NumberFormat(
      'vi-VN',
      {
        style: 'currency',
        currency: 'VND',
      },
    ).format(price);
  };

  return (
    <section className="py-12 bg-gradient-to-b from-[#eaf4fa] to-white">
      <SectionContainer className="relative">
        <SectionHeader title="Chăm sóc sức khỏe toàn diện" />

        <CarouselWrapper>
          {services.map((service) => (
            <div
              key={service.id}
              className="min-w-[270px] max-w-[270px] bg-white rounded-xl overflow-hidden shadow-md border border-slate-100 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-full h-[160px] overflow-hidden bg-slate-50">
                <img
                  src={
                    service.imageUrl ||
                    '/images/services/home/default.jpg'
                  }
                  alt={service.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-[#003B5C] text-[15px] leading-snug line-clamp-2 mb-3 min-h-[44px]">
                  {service.title}
                </h3>

                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-1.5 text-[13px] min-h-[42px]">
                    <Building2 className="w-[18px] h-[18px] text-slate-500 shrink-0" />

                    <span className="line-clamp-2 text-slate-600">
                      {service.clinicName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[13px]">
                    <CircleDollarSign className="w-[18px] h-[18px] text-slate-500" />

                    <span className="text-[#f58220] font-bold text-[15px]">
                      {formatPrice(
                        service.discountPrice,
                      )}
                    </span>

                    {service.originalPrice >
                      service.discountPrice && (
                      <span className="text-slate-400 line-through">
                        {formatPrice(
                          service.originalPrice,
                        )}
                      </span>
                    )}
                  </div>
                </div>

                <Button className="w-full mt-5 bg-[#00b5f1] hover:bg-[#0092c4] text-white rounded-xl h-[42px] font-bold">
                  Đặt khám ngay
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