// features/dashboard/components/common/DashboardFilterBar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

export default function DashboardFilterBar({ month, year, onMonthChange, onYearChange }: Props) {
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const monthRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: 1, label: 'Tháng 1' },
    { value: 2, label: 'Tháng 2' },
    { value: 3, label: 'Tháng 3' },
    { value: 4, label: 'Tháng 4' },
    { value: 5, label: 'Tháng 5' },
    { value: 6, label: 'Tháng 6' },
    { value: 7, label: 'Tháng 7' },
    { value: 8, label: 'Tháng 8' },
    { value: 9, label: 'Tháng 9' },
    { value: 10, label: 'Tháng 10' },
    { value: 11, label: 'Tháng 11' },
    { value: 12, label: 'Tháng 12' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (monthRef.current && !monthRef.current.contains(event.target as Node)) {
        setIsMonthOpen(false);
      }
      if (yearRef.current && !yearRef.current.contains(event.target as Node)) {
        setIsYearOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedMonth = months.find(m => m.value === month)?.label || 'Tháng';
  const selectedYear = year.toString();

  return (
    <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200/80 shadow-sm">
      {/* Month dropdown */}
      <div className="relative" ref={monthRef}>
        <button
          onClick={() => setIsMonthOpen(!isMonthOpen)}
          className="flex items-center gap-2 h-9 px-4 rounded-lg bg-slate-50/80 text-sm font-medium text-slate-700 border border-slate-200/60 hover:bg-slate-100/80 hover:border-slate-300/80 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          <Calendar size={14} className="text-slate-400" />
          <span>{selectedMonth}</span>
          <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isMonthOpen ? 'rotate-180' : ''}`} />
        </button>
        {isMonthOpen && (
          <div className="absolute left-0 top-full mt-1.5 w-48 bg-white rounded-xl border border-slate-200/80 shadow-lg z-50 p-1.5 max-h-60 overflow-y-auto custom-scrollbar">
            {months.map((m) => (
              <button
                key={m.value}
                onClick={() => {
                  onMonthChange(m.value);
                  setIsMonthOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                  m.value === month
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Year dropdown */}
      <div className="relative" ref={yearRef}>
        <button
          onClick={() => setIsYearOpen(!isYearOpen)}
          className="flex items-center gap-2 h-9 px-4 rounded-lg bg-slate-50/80 text-sm font-medium text-slate-700 border border-slate-200/60 hover:bg-slate-100/80 hover:border-slate-300/80 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          <span>{selectedYear}</span>
          <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isYearOpen ? 'rotate-180' : ''}`} />
        </button>
        {isYearOpen && (
          <div className="absolute left-0 top-full mt-1.5 w-32 bg-white rounded-xl border border-slate-200/80 shadow-lg z-50 p-1.5 max-h-60 overflow-y-auto custom-scrollbar">
            {years.map((y) => (
              <button
                key={y}
                onClick={() => {
                  onYearChange(y);
                  setIsYearOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                  y === year
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}