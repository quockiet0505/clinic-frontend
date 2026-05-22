// src/features/home/components/FeaturedDoctors.tsx

import React from 'react';

import {
  Star,
  User,
  Stethoscope,
  CircleDollarSign,
  Hospital,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
  CarouselWrapper,
  SectionContainer,
  SectionHeader,
  ViewAllButton,
} from '@/components/common';

import { homeApi } from '@/features/home/api/homeApi';

export const FeaturedDoctors: React.FC =
  () => {
    const doctors =
      homeApi.getFeaturedDoctors();

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
      <section className="py-12 bg-gradient-to-b from-white to-[#eaf4fa]">
        <SectionContainer className="relative">
          <SectionHeader title="Bác sĩ tư vấn khám bệnh qua video" />

          <CarouselWrapper>
            {doctors.map((doc, index) => (
              <div
                key={doc.id}
                className="min-w-[270px] max-w-[270px] bg-white rounded-xl shadow-md border border-slate-100 flex flex-col overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex justify-center pt-6 pb-4">
                  <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-100">
                    <img
                      src={doc.avatarUrl}
                      alt={doc.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-[12px] font-bold text-[#f58220] px-4 py-2 bg-[#f4f9fb]">
                  <div className="flex items-center gap-1">
                    <span className="text-[#003B5C]">
                      Đánh giá:
                    </span>

                    {doc.rating.toFixed(1)}

                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-[#003B5C]">
                      Lượt khám:
                    </span>

                    {10 + index * 15}

                    <User className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col text-[13.5px] text-[#003B5C]">
                  <div className="min-h-[72px]">
                    <p className="text-[14px]">
                      BS.
                    </p>

                    <h3 className="font-bold text-[18px] leading-tight mb-2">
                      {doc.fullName
                        .replace('BS.', '')
                        .replace(
                          'BS CKII.',
                          '',
                        )
                        .replace(
                          'BS CKI.',
                          '',
                        )
                        .trim()}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 min-h-[24px] mb-2">
                    <Stethoscope className="w-[18px] h-[18px] text-slate-500 shrink-0" />

                    <span className="line-clamp-1 text-slate-600">
                      {doc.specialtyName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 min-h-[24px] mb-2">
                    <CircleDollarSign className="w-[18px] h-[18px] text-slate-500 shrink-0" />

                    <span className="text-slate-600">
                      {formatPrice(
                        doc.consultationFee,
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 min-h-[24px]">
                    <Hospital className="w-[18px] h-[18px] text-slate-500 shrink-0" />

                    <span className="line-clamp-1 text-slate-600">
                      Bác sĩ chuyên khoa
                    </span>
                  </div>

                  <Button className="w-full mt-auto bg-[#00b5f1] hover:bg-[#0092c4] text-white rounded-xl h-[42px] font-bold">
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