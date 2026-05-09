import React from 'react';
import SearchInput from '@/components/common/SearchInput';
import DateRangeFilter from '@/components/common/DateRangeFilter';

export default function ExpenseFilterBar({ search, setSearch, category, setCategory, fromDate, toDate, setFromDate, setToDate }: any) {
  return (
    <div className="flex flex-col xl:flex-row gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm shrink-0 items-center justify-between">
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 font-bold text-slate-600 outline-none w-full sm:w-48 cursor-pointer">
          <option value="ALL">All Categories</option>
          <option value="Payroll">Payroll</option>
          <option value="Utilities">Utilities</option>
          <option value="Equipment">Equipment</option>
        </select>
        <div className="w-full sm:w-64"><SearchInput value={search} onChange={setSearch} placeholder="Search description..." /></div>
      </div>
      <DateRangeFilter from={fromDate} to={toDate} onChangeFrom={setFromDate} onChangeTo={setToDate} />
    </div>
  );
}