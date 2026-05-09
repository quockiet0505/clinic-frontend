import React from 'react';
import { CalendarDays, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Props {
  activeView: string; setActiveView: (v: any) => void;
  searchTerm: string; setSearchTerm: (v: string) => void;
}

export default function LeaveRequestsFilterBar({ activeView, setActiveView, searchTerm, setSearchTerm }: Props) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
        {['TODAY', 'PENDING', 'PROCESSED'].map(view => (
          <button key={view} onClick={() => setActiveView(view)} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeView === view ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {view}
          </button>
        ))}
      </div>
      <div className="relative w-full sm:w-72 px-2 sm:px-0 pr-2">
        <Search className="absolute left-5 sm:left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <Input placeholder="Search staff name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-10 rounded-xl bg-slate-50" />
      </div>
    </div>
  );
}