// src/features/home/components/SpecialtyCarousel.tsx
import React, { useState, useRef } from 'react';
import { SectionContainer, SectionHeader, ViewAllButton } from '@/components/common';
import { getStaticUrl } from '@/utils/url';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import type { Specialty } from '../types/home';

interface Props {
  specialties: Specialty[];
  isLoading?: boolean;
}

export const SpecialtyCarousel: React.FC<Props> = ({ specialties, isLoading }) => {
  const staticUrl = getStaticUrl();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const displaySpecialties = expanded ? specialties : specialties.slice(0, 14);

  const handleSpecialtyClick = (id: number) => {
    navigate(`/appointments/book?expertiseId=${id}`);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleViewAll = () => {
    setExpanded(true);
    // Smooth scroll to keep the section in view
    setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleCollapse = () => {
    setExpanded(false);
    setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <section id="specialties-section" ref={sectionRef} className="py-14 bg-gradient-to-b from-white via-gradient-white-blue to-gradient-blue">
      <SectionContainer className="max-w-5xl">
        <SectionHeader title="Chuyên khoa" />
        {expanded && (
          <div className="text-right mb-4">
            <button
              onClick={handleCollapse}
              className="inline-flex items-center gap-1 text-primary-500 font-bold text-sm hover:underline cursor-pointer"
            >
              Thu gọn <span className="text-base">↑</span>
            </button>
          </div>
        )}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-x-2 gap-y-10">
          {isLoading ? (
            Array(14).fill(0).map((_, i) => (
              <div key={`skel-spec-${i}`} className="flex flex-col items-center text-center animate-pulse">
                <div className="h-[60px] w-[60px] mb-3 rounded-full bg-slate-200"></div>
                <div className="h-3 w-16 bg-slate-200 rounded mt-1"></div>
              </div>
            ))
          ) : (
            displaySpecialties.map((item) => (
              <div
                key={item.expertiseId}
                onClick={() => handleSpecialtyClick(item.expertiseId)}
                className="cursor-pointer flex flex-col items-center text-center group"
              >
        <div className="h-[60px] w-[60px] mb-3 flex items-center justify-center relative">
                  <ImageWithFallback
                    src={`${staticUrl}${item.iconUrl}`}
                    alt={item.expertiseName}
                    className="max-w-full max-h-full transition-transform duration-300 group-hover:scale-110 object-contain"
                    containerClassName="absolute inset-0 w-full h-full flex items-center justify-center"
                  />
                </div>
                <span className="font-medium text-sm text-brand-dark group-hover:text-primary-500 transition-colors px-1 leading-snug">
                  {item.expertiseName}
                </span>
              </div>
            ))
          )}
        </div>
        {!expanded && !isLoading && (
          <div className="text-center mt-6">
            <ViewAllButton onClick={handleViewAll} />
          </div>
        )}
      </SectionContainer>
    </section>
  );
};