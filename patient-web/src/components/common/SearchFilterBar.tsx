// src/components/common/SearchFilterBar.tsx

import React from 'react';

import {
  Search,
  SlidersHorizontal,
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchFilterBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showFilter?: boolean;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
  showFilter = true,
}) => {
  return (
    <div className="w-full flex items-center gap-3">
      <div className="flex-1 bg-white rounded-full shadow-md flex items-center px-4 h-[52px] border border-slate-100">
        <Search className="w-5 h-5 text-[#00b5f1] shrink-0" />

        <Input
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="border-0 shadow-none focus-visible:ring-0 bg-transparent"
        />
      </div>

      {showFilter && (
        <Button
          variant="outline"
          className="rounded-full h-[52px] px-6 border-[#00b5f1] text-[#00b5f1]"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Bộ lọc
        </Button>
      )}
    </div>
  );
};