import React, { useEffect, useState } from 'react';
import { HeroSection } from '@/features/home/components/HeroSection';
import { SpecialtyCarousel } from '@/features/home/components/SpecialtyCarousel';
import { FeaturedDoctors } from '@/features/home/components/FeaturedDoctors';
import { HowItWorks } from '@/features/home/components/HowItWorks';
import { homeApi } from '../api/homeApi';

export const LandingPage: React.FC = () => {
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [specs, docs, servs] = await Promise.all([
          homeApi.getSpecialties(),
          homeApi.getDoctors(),
          homeApi.getServices(),
        ]);
        setSpecialties(specs);
        setDoctors(docs);
        setServices(servs);
      } catch (error) {
        console.error('Failed to load home data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Đang tải...</div>;
  }

  return (
    <main className="w-full min-h-screen overflow-x-hidden">
      <HeroSection />
      <SpecialtyCarousel specialties={specialties} />
      <FeaturedDoctors doctors={doctors} />
      <HowItWorks services={services} />
    </main>
  );
};