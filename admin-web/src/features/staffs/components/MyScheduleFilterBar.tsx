import React from 'react';
import DateRangeFilter from '@/components/common/DateRangeFilter';
import CustomSelect from '@/components/common/CustomSelect';

interface Props {
  statusFilter: string; setStatusFilter: (val: string) => void;
  fromDate: string; toDate: string;
  setFromDate: (val: string) => void; setToDate: (val: string) => void;
}

export default function MyScheduleFilterBar({ statusFilter, setStatusFilter, fromDate, toDate, setFromDate, setToDate }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm shrink-0 items-center justify-between">
      <div className="w-full sm:w-auto">
        <CustomSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-11">
          <option value="All">Tất cả Trạng thái</option>
          <option value="PENDING">Chờ duyệt</option>
          <option value="APPROVED">Đã duyệt</option>
          <option value="REJECTED">Đã từ chối</option>
        </CustomSelect>
      </div>
      <DateRangeFilter from={fromDate} to={toDate} onChangeFrom={setFromDate} onChangeTo={setToDate} />
    </div>
  );
}