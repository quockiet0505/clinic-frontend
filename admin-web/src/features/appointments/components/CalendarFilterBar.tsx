import React from 'react';
import { CalendarDays, UserSquare2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import CustomSelect from '@/components/common/CustomSelect';

interface CalendarFilterBarProps {
  doctorFilter: string;
  setDoctorFilter: (val: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  providers?: {id: string, name: string}[];
}

export default function CalendarFilterBar({
  doctorFilter, setDoctorFilter, selectedDate, setSelectedDate, providers = []
}: CalendarFilterBarProps) {
  return (
    <div className="flex flex-col xl:flex-row justify-between gap-4 items-center bg-white p-3 rounded-2xl border border-slate-200 shadow-sm shrink-0">
      
      {/* LEFT: DATE PICKER */}
      <div className="flex items-center gap-2 w-full xl:w-auto bg-slate-50 rounded-xl border border-slate-200 px-3 h-10">
        <CalendarDays size={16} className="text-slate-400" />
        <span className="text-sm font-bold text-slate-500 whitespace-nowrap">Đi tới ngày:</span>
        <Input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)}
          className="h-8 border-0 bg-transparent p-0 w-full sm:w-36 cursor-pointer font-bold text-blue-600 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      {/* RIGHT: DOCTOR FILTER & STATUS LEGEND */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto px-2 xl:px-0">
        
        {/* Legend mapped to DB Statuses */}
        <div className="hidden lg:flex items-center gap-4 px-4 text-xs font-bold text-slate-500">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-400"></div> Đã xác nhận</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-400"></div> Chờ khám</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-400"></div> Đã đến / Hoàn thành</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-400"></div> Đã hủy</div>
        </div>

        <div className="hidden lg:block h-8 w-px bg-slate-200"></div>

        {/* Doctor Filter */}
        <CustomSelect 
          value={doctorFilter} 
          onChange={(e) => setDoctorFilter(e.target.value)}
          className="h-11 w-full sm:w-48 text-sm font-bold text-slate-600"
        >
          <option value="ALL">Tất cả Bác sĩ</option>
          {providers.map(p => (
            <option key={p.id} value={p.name}>{p.name}</option>
          ))}
        </CustomSelect>
      </div>
      
    </div>
  );
}