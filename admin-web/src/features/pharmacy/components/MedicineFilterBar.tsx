import React from 'react';
import SearchInput from '@/components/common/SearchInput';

interface Props {
  search: string;
  setSearch: (v: string) => void;
}

export default function MedicineFilterBar({ search, setSearch }: Props) {
  return (
    <div className="bg-white p-3 rounded-2xl border border-slate-200 flex shadow-sm shrink-0 w-full sm:w-[400px]">
      <SearchInput 
        value={search} 
        onChange={setSearch} 
        placeholder="Tìm kiếm medicine by name or active element..." 
      />
    </div>
  );
}