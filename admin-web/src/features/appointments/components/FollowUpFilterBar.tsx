import React from 'react';
import SearchInput from '@/components/common/SearchInput';
import DateRangeFilter from '@/components/common/DateRangeFilter';

interface Props {
  tab: string; setTab: (v: string) => void;
  search: string; setSearch: (v: string) => void;
  fromDate: string; setFromDate: (v: string) => void;
  toDate: string; setToDate: (v: string) => void;
}

export default function FollowUpFilterBar({ tab, setTab, search, setSearch, fromDate, toDate, setFromDate, setToDate }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm shrink-0 items-center justify-between">
      <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
        {['PENDING', 'CONFIRMED', 'COMPLETED'].map(v => (
          <button key={v} onClick={() => setTab(v)} className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${tab === v ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{v}</button>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <div className="w-full sm:w-56"><SearchInput value={search} onChange={setSearch} placeholder="Search patient..." /></div>
        <DateRangeFilter from={fromDate} to={toDate} onChangeFrom={setFromDate} onChangeTo={setToDate} />
      </div>
    </div>
  );
}