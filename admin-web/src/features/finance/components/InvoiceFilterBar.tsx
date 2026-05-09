import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function InvoiceFilterBar({ search, setSearch, statusFilter, setStatusFilter }: any) {
  return (
    <div className="bg-white p-3 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3 shadow-sm shrink-0">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <Input 
          placeholder="Search by Patient Name or Bill ID..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="pl-10 h-10 rounded-xl border-slate-200 bg-slate-50 font-medium" 
        />
      </div>
      <div className="flex items-center gap-2">
        <Filter size={18} className="text-slate-400 ml-2" />
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)} 
          className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-600 focus:outline-none cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          <option value="UNPAID">Unpaid</option>
          <option value="PAID">Paid</option>
          <option value="REFUNDED">Refunded</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
    </div>
  );
}