import React from 'react';
import { SectionContainer, SectionHeader, ViewAllButton } from '@/components/common';
import { getStaticUrl } from '@/utils/url';
import type { Specialty } from '../types/home';

interface Props {
  specialties: Specialty[];
}

export const SpecialtyCarousel: React.FC<Props> = ({ specialties }) => {
  const staticUrl = getStaticUrl();

  return (
    <section className="py-14 bg-gradient-to-b from-white via-gradient-white-blue to-gradient-blue">
      <SectionContainer className="max-w-5xl">
        <SectionHeader title="Chuyên khoa" />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-x-2 gap-y-10">
          {specialties.slice(0, 14).map((item) => (
            <div key={item.expertiseId} className="cursor-pointer flex flex-col items-center group cursor-pointer text-center">
              <div className="h-[60px] w-[60px] mb-3 flex items-center justify-center">
                <img
                  src={`${staticUrl}${item.iconUrl}`}
                  alt={item.expertiseName}
                  className="max-w-full max-h-full transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <span className="font-medium text-[14px] text-brand-dark group-hover:text-primary-500 transition-colors px-1 leading-snug">
                {item.expertiseName}
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