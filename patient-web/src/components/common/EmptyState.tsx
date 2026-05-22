// src/components/common/EmptyState.tsx

import React from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Không có dữ liệu',
  description = 'Không tìm thấy dữ liệu phù hợp.',
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-10 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <SearchX className="w-8 h-8 text-slate-400" />
      </div>

      <h3 className="text-lg font-bold text-[#003B5C]">
        {title}
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
};