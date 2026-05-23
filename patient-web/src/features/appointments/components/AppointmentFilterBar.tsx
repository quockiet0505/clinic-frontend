import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { AppointmentStatus } from '../types/appointment';

interface Props {
  search: string;
  onSearchChange: (val: string) => void;
  status: AppointmentStatus | 'ALL';
  onStatusChange: (val: AppointmentStatus | 'ALL') => void;
}

export const AppointmentFilterBar: React.FC<Props> = ({ search, onSearchChange, status, onStatusChange }) => {
  const filters: { label: string; value: AppointmentStatus | 'ALL' }[] = [
    { label: 'Tất cả', value: 'ALL' },
    { label: 'Sắp tới', value: 'CONFIRMED' },
    { label: 'Đã khám', value: 'COMPLETED' },
    { label: 'Đã hủy', value: 'CANCELLED' },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
      {/* Status Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 [&::-webkit-scrollbar]:hidden">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onStatusChange(filter.value)}
            className={`px-5 py-2.5 rounded-2xl font-bold text-[14px] whitespace-nowrap transition-all duration-200 ${
              status === filter.value
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white border border-border-default text-slate-500 hover:text-primary-500 hover:border-primary-500'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative w-full md:w-80 shrink-0">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input 
          placeholder="Tìm bác sĩ, chuyên khoa..." 
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-12 pl-12 rounded-2xl bg-white border-border-default focus-visible:border-primary-500 focus-visible:ring-primary-500/20 shadow-none w-full"
        />
      </div>
    </div>
  );
};