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
    <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-[20px] border border-slate-200 shadow-sm shrink-0 items-center justify-between">
      <div className="flex bg-slate-50 p-1 rounded-2xl w-full sm:w-auto border border-slate-100">
        {[
          { label: 'Chờ xử lý', value: 'PENDING' },
          { label: 'Đã xác nhận', value: 'CONFIRMED' },
          { label: 'Hoàn thành', value: 'COMPLETED' }
        ].map(v => (
          <button key={v.value} onClick={() => setTab(v.value)} className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ease-out cursor-pointer ${tab === v.value ? 'bg-white text-primary-600 shadow-sm border border-slate-100/50' : 'text-slate-500 hover:text-primary-600 hover:bg-slate-100/50 border border-transparent'}`}>{v.label}</button>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <div className="w-full sm:w-64"><SearchInput value={search} onChange={setSearch} placeholder="Tìm kiếm bệnh nhân..." /></div>
        <DateRangeFilter from={fromDate} to={toDate} onChangeFrom={setFromDate} onChangeTo={setToDate} />
      </div>
    </div>
  );
}