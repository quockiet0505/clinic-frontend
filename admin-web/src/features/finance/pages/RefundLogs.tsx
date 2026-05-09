import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import SearchInput from '@/components/common/SearchInput';
import DateRangeFilter from '@/components/common/DateRangeFilter';
import RefundLogTable from '../components/RefundLogTable';

const TODAY = new Date().toISOString().split('T')[0];

const MOCK_REFUNDS = [
  { refund_id: 1, bill_id: 9005, refund_amount: 50.00, reason: 'Patient cancelled service before testing.', processed_by_name: 'Admin User', refunded_at: TODAY },
  { refund_id: 2, bill_id: 9008, refund_amount: 15.00, reason: 'Overcharged for consultation fee.', processed_by_name: 'Admin User', refunded_at: '2026-04-05' },
];

export default function RefundLogs() {
  const [logs] = useState(MOCK_REFUNDS);
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('2026-04-01');
  const [toDate, setToDate] = useState(TODAY);

  const filteredLogs = logs.filter(log => 
    (log.reason.toLowerCase().includes(search.toLowerCase()) || log.bill_id.toString().includes(search)) &&
    log.refunded_at >= fromDate && log.refunded_at <= toDate
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <PageHeader title="Refund Logs" description="Audit trail of all money refunded to patients." />

      <div className="bg-white p-3 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="w-full sm:w-80">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by Bill ID or Reason..." />
        </div>
        <DateRangeFilter from={fromDate} to={toDate} onChangeFrom={setFromDate} onChangeTo={setToDate} />
      </div>

      <RefundLogTable data={filteredLogs} />
    </div>
  );
}