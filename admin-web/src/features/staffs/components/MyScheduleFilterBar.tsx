import React from 'react';
import DateRangeFilter from '@/components/common/DateRangeFilter';

interface Props {
  statusFilter: string; setStatusFilter: (val: string) => void;
  fromDate: string; toDate: string;
  setFromDate: (val: string) => void; setToDate: (val: string) => void;
}

export default function MyScheduleFilterBar({ statusFilter, setStatusFilter, fromDate, toDate, setFromDate, setToDate }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm shrink-0 items-center justify-between">
      <div className="w-full sm:w-auto">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 w-full sm:w-48 rounded-xl border border-slate-200 bg-slate-50 px-3 font-bold text-slate-600 outline-none cursor-pointer">
          <option value="All">Tất cả Trạng thái</option>
          <option value="PENDING">Chờ khám</option>
          <option value="APPROVED">Đã duyệt</option>
          <option value="REJECTED">Đã từ chối</option>
        </select>
      </div>
      <DateRangeFilter from={fromDate} to={toDate} onChangeFrom={setFromDate} onChangeTo={setToDate} />
    </div>
  );
}