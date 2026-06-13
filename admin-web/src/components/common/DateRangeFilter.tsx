import React from 'react';
import { CalendarDays } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Props {
  from: string; to: string;
  onChangeFrom: (val: string) => void; onChangeTo: (val: string) => void;
}

export default function DateRangeFilter({ from, to, onChangeFrom, onChangeTo }: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
      <div className="flex items-center bg-white border border-slate-200 rounded-[16px] px-3 h-11 relative w-full sm:w-auto">
        <span className="text-sm font-medium text-slate-700 mr-2 shrink-0">Từ</span>
        <input 
          type="date" 
          value={from} 
          max={to || undefined} 
          onChange={(e) => { 
            const val = e.target.value; 
            if (to && val > to) onChangeTo(val); 
            onChangeFrom(val); 
          }} 
          className="h-full border-0 bg-transparent px-0 w-[130px] text-sm font-medium text-primary-600 outline-none cursor-pointer date-input-colored"
        />
      </div>
      
      <div className="flex items-center bg-white border border-slate-200 rounded-[16px] px-3 h-11 relative w-full sm:w-auto">
        <span className="text-sm font-medium text-slate-700 mr-2 shrink-0">Đến</span>
        <input 
          type="date" 
          value={to} 
          min={from || undefined} 
          onChange={(e) => { 
            const val = e.target.value; 
            if (from && val < from) onChangeFrom(val); 
            onChangeTo(val); 
          }} 
          className="h-full border-0 bg-transparent px-0 w-[130px] text-sm font-medium text-primary-600 outline-none cursor-pointer date-input-colored"
        />
      </div>
    </div>
  );
}