import React from 'react';
import { Activity, Stethoscope, SlidersHorizontal } from 'lucide-react';
import SearchInput from '@/components/common/SearchInput';
import DateRangeFilter from '@/components/common/DateRangeFilter';

interface Props {
  search: string; setSearch: (v: string) => void;
  statusFilter: string; setStatusFilter: (v: string) => void;
  doctorFilter: string; setDoctorFilter: (v: string) => void;
  fromDate: string; setFromDate: (v: string) => void;
  toDate: string; setToDate: (v: string) => void;
}

export default function ActiveVisitsFilterBar({ search, setSearch, statusFilter, setStatusFilter, doctorFilter, setDoctorFilter, fromDate, toDate, setFromDate, setToDate }: Props) {
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
        <div className="flex items-center gap-1.5 bg-slate-50 rounded-xl border border-slate-200 px-3 h-9 w-full sm:w-auto shrink-0">
          <Stethoscope size={13} className="text-slate-400 shrink-0" />
          <select value={doctorFilter} onChange={(e) => setDoctorFilter(e.target.value)} className="h-8 bg-transparent text-sm font-bold text-slate-600 cursor-pointer w-full sm:w-28">
            <option value="ALL">Tất cả</option>
            <option value="Dr. Sarah Smith">Dr. Sarah Smith</option>
            <option value="Dr. Robert Davis">Dr. Robert Davis</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-50 rounded-xl border border-slate-200 px-3 h-9 w-full sm:w-auto shrink-0">
          <SlidersHorizontal size={13} className="text-slate-400 shrink-0" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-8 bg-transparent text-sm font-bold text-slate-600 cursor-pointer w-full sm:w-28">
            <option value="ALL">Tất cả</option>
            <option value="PENDING">Chờ khám</option>
            <option value="IN_PROGRESS">Đang khám</option>
            <option value="WAITING_RESULT">Chờ kết quả</option>
            <option value="DONE">Hoàn thành</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
        </div>

        <div className="w-full sm:w-48 shrink-0">
          <SearchInput value={search} onChange={setSearch} placeholder="Tìm kiếm bệnh nhân..." />
        </div>
        <DateRangeFilter from={fromDate} to={toDate} onChangeFrom={setFromDate} onChangeTo={setToDate} />
      </div>
    </div>
  );
}