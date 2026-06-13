import React from 'react';
import SearchInput from '@/components/common/SearchInput';
import DateRangeFilter from '@/components/common/DateRangeFilter';

interface Props {
  search: string; setSearch: (v: string) => void;
  statusFilter: string; setStatusFilter: (v: string) => void;
  fromDate: string; setFromDate: (v: string) => void;
  toDate: string; setToDate: (v: string) => void;
}

export default function ServiceOrdersFilterBar({ search, setSearch, statusFilter, setStatusFilter, fromDate, toDate, setFromDate, setToDate }: Props) {
  return (
    <div className="flex flex-col xl:flex-row gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm shrink-0 items-center justify-between">
      <div className="flex bg-slate-100 p-1 rounded-xl w-full xl:w-auto">
        {['ALL', 'ORDERED', 'DONE', 'REJECTED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`cursor-pointer flex-1 xl:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
              statusFilter === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'ALL' ? 'Tất cả' : tab === 'ORDERED' ? 'Chờ lấy mẫu' : tab === 'DONE' ? 'Đã có kết quả' : 'Từ chối mẫu'}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
        <div className="w-full sm:w-64">
          <SearchInput value={search} onChange={setSearch} placeholder="Tìm kiếm bệnh nhân hoặc xét nghiệm..." />
        </div>
        <DateRangeFilter from={fromDate} to={toDate} onChangeFrom={setFromDate} onChangeTo={setToDate} />
      </div>
    </div>
  );
}