// src/components/common/SectionContainer.tsx

import React from 'react';

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionContainer: React.FC<SectionContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <section
      className={`container mx-auto px-4 max-w-6xl ${className}`}
    >
      {children}
    </section>
  );
};