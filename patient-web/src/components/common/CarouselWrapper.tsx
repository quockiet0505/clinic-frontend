// src/components/common/CarouselWrapper.tsx

import React from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface CarouselWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const CarouselWrapper: React.FC<CarouselWrapperProps> = ({
  children,
  className = '',
}) => {
  return (
    <ScrollArea className="w-full">
      <div
        className={`flex gap-5 pb-4 ${className}`}
      >
        {children}
      </div>

      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};