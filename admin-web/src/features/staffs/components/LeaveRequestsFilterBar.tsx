import React from 'react';
import { CalendarDays, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Props {
  activeView: string; setActiveView: (v: any) => void;
  searchTerm: string; setSearchTerm: (v: string) => void;
}

export default function LeaveRequestsFilterBar({ activeView, setActiveView, searchTerm, setSearchTerm }: Props) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-[20px] border border-slate-200 shadow-sm">
      <div className="flex bg-slate-50 p-1 rounded-2xl w-full sm:w-auto border border-slate-100">
        {[
          { label: 'Hôm nay', value: 'TODAY' },
          { label: 'Chờ duyệt', value: 'PENDING' },
          { label: 'Đã xử lý', value: 'PROCESSED' }
        ].map(view => (
          <button key={view.value} onClick={() => setActiveView(view.value)} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ease-out cursor-pointer ${activeView === view.value ? 'bg-white text-primary-600 shadow-sm border border-slate-100/50' : 'text-slate-500 hover:text-primary-600 hover:bg-slate-100/50'}`}>
            {view.label}
          </button>
        ))}
      </div>
      <div className="relative w-full sm:w-80 px-2 sm:px-0 pr-2">
        <Search className="absolute left-5 sm:left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <Input placeholder="Tìm kiếm tên nhân viên..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-11 rounded-[16px] border-input bg-slate-50 text-sm font-medium hover:border-primary-300 focus-visible:border-primary-400 focus-visible:ring-4 focus-visible:ring-primary-100 transition-all duration-200 ease-out shadow-sm" />
      </div>
    </div>
  );
}