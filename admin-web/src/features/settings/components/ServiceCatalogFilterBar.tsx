import React from 'react';
import SearchInput from '@/components/common/SearchInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ServiceCatalogFilterBar({ search, onSearch, type, onTypeChange }: any) {
  return (
    <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <SearchInput value={search} onChange={onSearch} placeholder="Search services..." />
      </div>
      <Select value={type} onValueChange={onTypeChange}>
        <SelectTrigger className="w-full sm:w-[200px] h-11 rounded-xl bg-slate-50 border-none font-bold text-slate-600">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-slate-100">
          <SelectItem value="ALL">All Types</SelectItem>
          <SelectItem value="EXAM">Exam</SelectItem>
          <SelectItem value="LAB_TEST">Lab Test</SelectItem>
          <SelectItem value="IMAGING">Imaging</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}