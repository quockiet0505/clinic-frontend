import React from 'react';
import SearchInput from '@/components/common/SearchInput';
import DateRangeFilter from '@/components/common/DateRangeFilter';

interface Props {
  search: string; setSearch: (v: string) => void;
  fromDate: string; setFromDate: (v: string) => void;
  toDate: string; setToDate: (v: string) => void;
}

export default function LabResultsFilterBar({ search, setSearch, fromDate, toDate, setFromDate, setToDate }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm shrink-0 items-center justify-between">
      <div className="w-full sm:w-80"><SearchInput value={search} onChange={setSearch} placeholder="Tìm kiếm patient, test, or ID..." /></div>
      <DateRangeFilter from={fromDate} to={toDate} onChangeFrom={setFromDate} onChangeTo={setToDate} />
    </div>
  );
}