import React from 'react';
import { Globe, UserRound, LayoutList } from 'lucide-react';
import SearchInput from '@/components/common/SearchInput';
import DateRangeFilter from '@/components/common/DateRangeFilter';

interface Props {
  search: string; setSearch: (v: string) => void;
  typeFilter: string; setTypeFilter: (v: string) => void;
  fromDate: string; setFromDate: (v: string) => void;
  toDate: string; setToDate: (v: string) => void;
}

const SOURCE_TABS = [
  { label: 'Tất cả', value: 'ALL', icon: <Globe size={14} /> },
  { label: 'Trực tuyến', value: 'ONLINE', icon: <Globe size={14} /> },
  { label: 'Khách vãng lai', value: 'WALK_IN', icon: <UserRound size={14} /> }
];

export default function AppointmentFilterBar({ search, setSearch, typeFilter, setTypeFilter, fromDate, toDate, setFromDate, setToDate }: Props) {
  return (
    <div className="flex flex-col xl:flex-row gap-4 bg-white p-4 rounded-[20px] border border-slate-200 shadow-sm shrink-0 items-center justify-between">
      
      {/* TABS LỌC NGUỒN */}
      <div className="flex flex-wrap bg-slate-50 p-1 rounded-2xl w-full xl:w-auto overflow-x-auto border border-slate-100">
        {SOURCE_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setTypeFilter(tab.value)}
            className={`flex-1 xl:flex-none px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ease-out whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer ${
              typeFilter === tab.value 
                ? 'bg-white text-primary-600 shadow-sm border border-slate-100/50' 
                : 'text-slate-500 hover:text-primary-600 hover:bg-slate-100/50 border border-transparent'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* TÌM KIẾM & NGÀY THÁNG */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">

        
        <div className="w-full sm:w-56">
          <SearchInput value={search} onChange={setSearch} placeholder="Tìm kiếm bệnh nhân..." />
        </div>
        
        <DateRangeFilter from={fromDate} to={toDate} onChangeFrom={setFromDate} onChangeTo={setToDate} />
      </div>
    </div>
  );
}