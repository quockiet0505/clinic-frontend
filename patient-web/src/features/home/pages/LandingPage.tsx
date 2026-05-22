// src/features/home/pages/LandingPage.tsx

import React from 'react';

import { HeroSection } from '@/features/home/components/HeroSection';

import { SpecialtyCarousel } from '@/features/home/components/SpecialtyCarousel';

import { FeaturedDoctors } from '@/features/home/components/FeaturedDoctors';

import { HowItWorks } from '@/features/home/components/HowItWorks';

export const LandingPage: React.FC =
  () => {
    return (
      <main className="w-full min-h-screen overflow-x-hidden">
        <HeroSection />

        <SpecialtyCarousel />

        <FeaturedDoctors />

        <HowItWorks />
      </main>
    );
  };