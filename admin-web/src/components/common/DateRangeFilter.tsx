import React from 'react';
import { CalendarDays } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Props {
  from: string; to: string;
  onChangeFrom: (val: string) => void; onChangeTo: (val: string) => void;
}

export default function DateRangeFilter({ from, to, onChangeFrom, onChangeTo }: Props) {
  return (
    <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 h-10 hover:bg-slate-100 transition-colors group">
        <CalendarDays size={16} className="text-slate-400 group-hover:text-blue-500 mr-2 transition-colors" />
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mr-2">Từ</span>
        <Input 
          type="date" value={from} max={to || undefined} 
          onChange={(e) => { const val = e.target.value; if (to && val > to) onChangeTo(val); onChangeFrom(val); }} 
          className="h-full border-0 bg-transparent px-0 w-28 text-sm font-bold text-blue-600 focus-visible:ring-0 shadow-none cursor-pointer" 
        />
      </div>
      
      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 h-10 hover:bg-slate-100 transition-colors group">
        <CalendarDays size={16} className="text-slate-400 group-hover:text-rose-500 mr-2 transition-colors" />
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mr-2">Đến</span>
        <Input 
          type="date" value={to} min={from || undefined} 
          onChange={(e) => { const val = e.target.value; if (from && val < from) onChangeFrom(val); onChangeTo(val); }} 
          className="h-full border-0 bg-transparent px-0 w-28 text-sm font-bold text-blue-600 focus-visible:ring-0 shadow-none cursor-pointer" 
        />
      </div>
    </div>
  );
}