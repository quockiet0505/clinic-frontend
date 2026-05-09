import React from 'react';
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
    <div className="flex flex-col xl:flex-row gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm shrink-0 items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 font-bold text-slate-600 outline-none cursor-pointer">
          <option value="ALL">All Active Statuses</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="WAITING_RESULT">Waiting for Lab Results</option>
        </select>
        <select value={doctorFilter} onChange={(e) => setDoctorFilter(e.target.value)} className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 font-bold text-slate-600 outline-none cursor-pointer">
          <option value="ALL">All Doctors</option>
          <option value="Dr. Sarah Smith">Dr. Sarah Smith</option>
          <option value="Dr. Robert Davis">Dr. Robert Davis</option>
        </select>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
        <div className="w-full sm:w-56"><SearchInput value={search} onChange={setSearch} placeholder="Search patient..." /></div>
        <DateRangeFilter from={fromDate} to={toDate} onChangeFrom={setFromDate} onChangeTo={setToDate} />
      </div>
    </div>
  );
}