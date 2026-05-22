// src/components/common/SectionHeader.tsx

import React from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
  centered?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  centered = true,
}) => {
  return (
    <div className={centered ? 'text-center mb-8' : 'mb-8'}>
      <h2 className="text-2xl font-black text-[#003B5C] uppercase tracking-wide">
        {title}
      </h2>

      {description && (
        <p className="mt-2 text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
};