import React from 'react';
import { CalendarDays } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Props {
  from: string; to: string;
  onChangeFrom: (val: string) => void; onChangeTo: (val: string) => void;
}

export default function DateRangeFilter({ from, to, onChangeFrom, onChangeTo }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
      <div className="flex items-center gap-2 bg-slate-50 rounded-xl border border-slate-200 px-3 h-10 w-full sm:w-auto shrink-0">
        <CalendarDays size={16} className="text-slate-400" />
        <span className="text-sm font-bold text-slate-500">From:</span>
        <Input type="date" value={from} max={to || undefined} onChange={(e) => { const val = e.target.value; if (to && val > to) onChangeTo(val); onChangeFrom(val); }} className="h-8 border-0 bg-transparent p-0 w-32 font-bold text-blue-600 focus-visible:ring-0 cursor-pointer" />
      </div>
      <div className="flex items-center gap-2 bg-slate-50 rounded-xl border border-slate-200 px-3 h-10 w-full sm:w-auto shrink-0">
        <CalendarDays size={16} className="text-slate-400" />
        <span className="text-sm font-bold text-slate-500">To:</span>
        <Input type="date" value={to} min={from || undefined} onChange={(e) => { const val = e.target.value; if (from && val < from) onChangeFrom(val); onChangeTo(val); }} className="h-8 border-0 bg-transparent p-0 w-32 font-bold text-blue-600 focus-visible:ring-0 cursor-pointer" />
      </div>
    </div>
  );
}