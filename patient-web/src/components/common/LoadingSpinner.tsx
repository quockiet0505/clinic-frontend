// src/components/common/LoadingSpinner.tsx

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text = 'Đang tải dữ liệu...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <Loader2 className="w-8 h-8 animate-spin text-[#00b5f1]" />

      <p className="mt-3 text-sm text-slate-500">
        {text}
      </p>
    </div>
  );
};