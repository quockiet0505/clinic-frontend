import React from 'react';
import SearchInput from '@/components/common/SearchInput';
import DateRangeFilter from '@/components/common/DateRangeFilter';

export default function PrescriptionFilterBar({ search, setSearch, statusFilter, setStatusFilter, fromDate, toDate, setFromDate, setToDate }: any) {
  return (
    <div className="flex flex-col xl:flex-row gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm shrink-0 items-center justify-between">
      <div className="flex bg-slate-100 p-1 rounded-xl w-full xl:w-auto">
        {['ALL', 'PENDING', 'DISPENSED'].map((tab) => (
          <button key={tab} onClick={() => setStatusFilter(tab)} className={`flex-1 xl:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${statusFilter === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {tab === 'ALL' ? 'All Prescriptions' : tab}
          </button>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
        <div className="w-full sm:w-56"><SearchInput value={search} onChange={setSearch} placeholder="Tìm kiếm bệnh nhân..." /></div>
        <DateRangeFilter from={fromDate} to={toDate} onChangeFrom={setFromDate} onChangeTo={setToDate} />
      </div>
    </div>
  );
}