import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import SearchInput from '@/components/common/SearchInput';
import DateRangeFilter from '@/components/common/DateRangeFilter';
import InventoryLogTable from '../components/InventoryLogTable';
import { InventoryTransaction } from '../types/pharmacy';

const TODAY = new Date().toISOString().split('T')[0];

export default function InventoryLogs() {
  const [logs] = useState<InventoryTransaction[]>([
    { transaction_id: 1, medicine_id: 101, medicine_name: 'Amoxil 500mg', transaction_type: 'IMPORT', quantity: 500, reference_id: 'PO-2026001', handled_by_name: 'Admin', created_at: `${TODAY} 09:00`, note: 'Restocked from PharmaCorp' },
    { transaction_id: 2, medicine_id: 102, medicine_name: 'Panadol', transaction_type: 'DISPENSE', quantity: -2, reference_id: 'RX-9002', handled_by_name: 'Pharmacist Jane', created_at: `${TODAY} 10:30`, note: 'Prescription fulfilled' },
    { transaction_id: 3, medicine_id: 104, medicine_name: 'Lipitor 20mg', transaction_type: 'EXPIRED', quantity: -10, handled_by_name: 'Pharmacist Jane', created_at: `${TODAY} 11:00`, note: 'Batch Expired' },
  ]);
  
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [fromDate, setFromDate] = useState(TODAY);
  const [toDate, setToDate] = useState(TODAY);

  const filtered = logs.filter(l => 
    (typeFilter === 'ALL' || l.transaction_type === typeFilter) &&
    (l.medicine_name.toLowerCase().includes(search.toLowerCase()) || l.reference_id?.toLowerCase().includes(search.toLowerCase())) &&
    (l.created_at >= fromDate && l.created_at <= `${toDate} 23:59`)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <PageHeader title="Inventory Logs" description="Audit trail of all medicine stock movements (Imports, Dispenses, Adjustments)." />

      <div className="flex flex-col xl:flex-row gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm shrink-0 items-center justify-between">
        <div className="flex bg-slate-100 p-1 rounded-xl w-full xl:w-auto overflow-x-auto custom-scrollbar">
          {['ALL', 'IMPORT', 'DISPENSE', 'EXPIRED', 'LOST', 'ADJUSTMENT'].map(tab => (
            <button key={tab} onClick={() => setTypeFilter(tab)} className={`flex-1 xl:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${typeFilter === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          <div className="w-full sm:w-64"><SearchInput value={search} onChange={setSearch} placeholder="Search medicine or Ref ID..." /></div>
          <DateRangeFilter from={fromDate} to={toDate} onChangeFrom={setFromDate} onChangeTo={setToDate} />
        </div>
      </div>

      <InventoryLogTable data={filtered} />
    </div>
  );
}