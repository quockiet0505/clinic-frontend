// src/components/common/ViewAllButton.tsx
import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ViewAllButtonProps {
  text?: string;
  onClick?: () => void;
}

export const ViewAllButton: React.FC<ViewAllButtonProps> = ({ text = 'Xem tất cả', onClick }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center h-[46px] px-8 rounded-2xl font-bold text-primary-500 bg-transparent ring-1 ring-inset ring-transparent hover:ring-primary-500 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
    >
      {text}
      <div className="flex -space-x-1.5 ml-2 items-center">
        <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-300" />
        <ChevronRight className="w-5 h-5 opacity-40 group-hover:translate-x-1 transition-transform duration-300" />
      </div>
    </button>
  );
};