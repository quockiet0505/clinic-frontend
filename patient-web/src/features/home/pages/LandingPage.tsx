import React, { useEffect, useState } from 'react';
import { HeroSection } from '@/features/home/components/HeroSection';
import { SpecialtyCarousel } from '@/features/home/components/SpecialtyCarousel';
import { FeaturedDoctors } from '@/features/home/components/FeaturedDoctors';
import { HowItWorks } from '@/features/home/components/HowItWorks';
import { homeApi } from '../api/homeApi';

export const LandingPage: React.FC = () => {
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [specs, docs, servs] = await Promise.all([
          homeApi.getSpecialties(),
          homeApi.getFeaturedDoctors(),
          homeApi.getFeaturedServices(),
        ]);
        setSpecialties(Array.isArray(specs) ? specs : []);
        setDoctors(Array.isArray(docs) ? docs : []);
        setServices(Array.isArray(servs) ? servs : []);
      } catch (error) {
        console.error('Failed to load home data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sort specialties: ones with at least one doctor appear first
  const sortedSpecialties = [...specialties].sort((a: any, b: any) => {
    const aHasDoctor = doctors.some((doc: any) => doc.expertiseId === a.expertiseId);
    const bHasDoctor = doctors.some((doc: any) => doc.expertiseId === b.expertiseId);
    if (aHasDoctor && !bHasDoctor) return -1;
    if (!aHasDoctor && bHasDoctor) return 1;
    return 0;
  });

  return (
    <main className="w-full min-h-screen overflow-x-hidden">
      <HeroSection />
      <SpecialtyCarousel specialties={sortedSpecialties} isLoading={isLoading} />
      <FeaturedDoctors doctors={doctors} isLoading={isLoading} />
      <HowItWorks services={services} isLoading={isLoading} />
    </main>
  );
};