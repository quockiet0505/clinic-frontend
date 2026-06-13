import React from 'react';
import { Activity } from 'lucide-react';
import SearchInput from '@/components/common/SearchInput';
import DateRangeFilter from '@/components/common/DateRangeFilter';

interface Props {
  search: string; setSearch: (v: string) => void;
  fromDate: string; setFromDate: (v: string) => void;
  toDate: string; setToDate: (v: string) => void;
}

export default function ActiveVisitsFilterBar({ search, setSearch, fromDate, toDate, setFromDate, setToDate }: Props) {
  return (
    <div className="flex flex-col xl:flex-row gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm shrink-0 items-center justify-between">
      
      {/* Title section */}
      <div className="flex bg-slate-100/80 p-1 rounded-xl w-full xl:w-auto gap-0.5 hidden xl:flex">
         <div className="flex items-center gap-1.5 px-3">
           <Activity size={14} className="text-slate-400" />
           <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Đang khám</span>
         </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full xl:w-auto overflow-x-auto xl:overflow-visible pb-1 xl:pb-0">

        <div className="w-full sm:w-48 shrink-0">
          <SearchInput value={search} onChange={setSearch} placeholder="Tìm kiếm bệnh nhân..." />
        </div>
        <DateRangeFilter from={fromDate} to={toDate} onChangeFrom={setFromDate} onChangeTo={setToDate} />
      </div>
    </div>
  );
}