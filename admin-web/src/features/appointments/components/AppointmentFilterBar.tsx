import React from 'react';
import SearchInput from '@/components/common/SearchInput';
import DateRangeFilter from '@/components/common/DateRangeFilter';

interface Props {
  search: string; setSearch: (v: string) => void;
  statusFilter: string; setStatusFilter: (v: string) => void;
  typeFilter: string; setTypeFilter: (v: string) => void;
  fromDate: string; setFromDate: (v: string) => void;
  toDate: string; setToDate: (v: string) => void;
}

const SOURCE_TABS = [
  { label: 'All ', value: 'ALL' },
  { label: 'Online ', value: 'ONLINE' },
  { label: 'Walk-In', value: 'WALK_IN' }
];

export default function AppointmentFilterBar({ search, setSearch, statusFilter, setStatusFilter, typeFilter, setTypeFilter, fromDate, toDate, setFromDate, setToDate }: Props) {
  return (
    <div className="flex flex-col xl:flex-row gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm shrink-0 items-center justify-between">
      
      {/* TABS LỌC NGUỒN (Đúng chuẩn code cũ của sếp) */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-full xl:w-auto overflow-x-auto">
        {SOURCE_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setTypeFilter(tab.value)}
            className={`flex-1 xl:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
              typeFilter === tab.value 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TÌM KIẾM, LỌC TRẠNG THÁI & NGÀY THÁNG */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)} 
          className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 font-bold text-slate-600 outline-none w-full sm:w-auto cursor-pointer"
        >
          <option value="ALL">Tất cả Trạng thái</option>
          <option value="PENDING">Chờ khám</option>
          <option value="CONFIRMED">Đã xác nhận</option>
          <option value="CHECKED_IN">Đã đến</option>
          <option value="IN_PROGRESS">Đang khám</option>
          <option value="COMPLETED">Hoàn thành</option>
          <option value="CANCELLED">Đã hủy</option>
        </select>
        
        <div className="w-full sm:w-56">
          <SearchInput value={search} onChange={setSearch} placeholder="Tìm kiếm bệnh nhân..." />
        </div>
        
        <DateRangeFilter from={fromDate} to={toDate} onChangeFrom={setFromDate} onChangeTo={setToDate} />
      </div>
    </div>
  );
}