// features/appointments/components/CalendarFilterBar.tsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FilterBar, FilterOption } from '@/components/common/FilterBar';

interface CalendarFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  doctorFilter: string;
  onDoctorFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  fromDate: string;
  toDate: string;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  doctorOptions: FilterOption[];
  statusOptions: FilterOption[];
  currentWeekStart: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
  formatDate: (date: Date) => string;
}

export const CalendarFilterBar: React.FC<CalendarFilterBarProps> = ({
  search,
  onSearchChange,
  doctorFilter,
  onDoctorFilterChange,
  statusFilter,
  onStatusFilterChange,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  doctorOptions,
  statusOptions,
  currentWeekStart,
  onPreviousWeek,
  onNextWeek,
  onToday,
  formatDate,
}) => {
  const weekEnd = new Date(currentWeekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return (
    <FilterBar
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm kiếm bệnh nhân..."
      filters={[
        {
          key: 'doctor',
          label: 'Bác sĩ',
          options: doctorOptions,
          value: doctorFilter,
          onChange: onDoctorFilterChange,
          placeholder: 'Chọn bác sĩ',
        },
        {
          key: 'status',
          label: 'Trạng thái',
          options: statusOptions,
          value: statusFilter,
          onChange: onStatusFilterChange,
          placeholder: 'Trạng thái',
        },
      ]}
      advancedFilters={{
        dateRange: {
          from: fromDate,
          to: toDate,
          onFromChange: onFromDateChange,
          onToChange: onToDateChange,
        },
      }}
    >
      <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-1.5 border border-slate-200 shrink-0 ml-auto">
        <button
          onClick={onPreviousWeek}
          className="p-1 rounded hover:bg-slate-200 text-slate-500 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="text-center min-w-[180px]">
          <span className="text-sm font-semibold text-slate-700">
            {formatDate(currentWeekStart)} – {formatDate(weekEnd)}
          </span>
        </div>
        <button
          onClick={onNextWeek}
          className="p-1 rounded hover:bg-slate-200 text-slate-500 transition-colors"
        >
          <ChevronRight size={18} />
        </button>
        <button
          onClick={onToday}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 ml-1 whitespace-nowrap"
        >
          Hôm nay
        </button>
      </div>
    </FilterBar>
  );
};