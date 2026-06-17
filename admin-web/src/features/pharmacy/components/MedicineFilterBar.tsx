// features/pharmacy/components/MedicineFilterBar.tsx
import React from 'react';
import SearchInput from '@/components/common/SearchInput';

interface Props {
  search: string;
  setSearch: (v: string) => void;
}

export default function MedicineFilterBar({ search, setSearch }: Props) {
  return (
    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm shrink-0">
      <div className="w-full sm:w-[320px]">
        <SearchInput 
          value={search} 
          onChange={setSearch} 
          placeholder="Tìm tên thuốc, hoạt chất..." 
        />
      </div>
    </div>
  );
}