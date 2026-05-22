// src/features/home/components/SpecialtyCarousel.tsx

import React from 'react';

import {
  SectionContainer,
  SectionHeader,
  ViewAllButton,
} from '@/components/common';

import { homeApi } from '@/features/home/api/homeApi';

export const SpecialtyCarousel: React.FC =
  () => {
    const specialties =
      homeApi.getSpecialties();

    return (
      <section className="py-12 bg-gradient-to-b from-[#eaf4fa] to-white">
        <SectionContainer className="max-w-5xl">
          <SectionHeader title="Chuyên khoa" />

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-x-2 gap-y-10">
            {specialties
              .slice(0, 14)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center group cursor-pointer text-center"
                >
                  <div className="h-[60px] w-[60px] mb-3 flex items-center justify-center">
                    <img
                      src={item.iconUrl}
                      alt={item.name}
                      className="max-w-full max-h-full transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  <span className="font-medium text-[14px] text-[#003B5C] group-hover:text-[#00b5f1] transition-colors px-1 leading-snug">
                    {item.name}
                  </span>
                </div>
              ))}
          </div>

          <div className="text-center mt-12">
            <ViewAllButton />
          </div>
        </SectionContainer>
      </section>
    );
  };