import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import SearchInput from '@/components/common/SearchInput';
import DateRangeFilter from '@/components/common/DateRangeFilter';
import NotificationTable from '../components/NotificationTable';
import { AppNotification } from '../types/crm';

const TODAY = new Date().toISOString().split('T')[0];

export default function Notifications() {
  const [notifications] = useState<AppNotification[]>([
    { notification_id: 1, account_name: 'Liam Anderson', type: 'SYSTEM', content: 'Friendly reminder: You are due for a post-surgery checkup.', sent_at: `${TODAY} 09:30` },
    { notification_id: 2, account_name: 'Emma Watson', type: 'EMAIL', content: 'Your lab results for Lipid Panel are ready.', sent_at: `${TODAY} 10:15` },
  ]);
  
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [fromDate, setFromDate] = useState(TODAY);
  const [toDate, setToDate] = useState(TODAY);

  const filtered = notifications.filter(n => 
    (typeFilter === 'ALL' || n.type === typeFilter) &&
    (n.account_name?.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase())) &&
    (n.sent_at >= fromDate && n.sent_at <= `${toDate} 23:59`)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <PageHeader title="Notification Audit Log" description="A read-only log of all system and email alerts sent to patients." />
      
      <div className="flex flex-col xl:flex-row gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm shrink-0 items-center justify-between">
        <div className="flex bg-slate-100 p-1 rounded-xl w-full xl:w-auto">
          {['ALL', 'SYSTEM', 'EMAIL'].map(tab => (
            <button key={tab} onClick={() => setTypeFilter(tab)} className={`flex-1 xl:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${typeFilter === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          <div className="w-full sm:w-64"><SearchInput value={search} onChange={setSearch} placeholder="Search recipient or content..." /></div>
          <DateRangeFilter from={fromDate} to={toDate} onChangeFrom={setFromDate} onChangeTo={setToDate} />
        </div>
      </div>

      <NotificationTable data={filtered} />
    </div>
  );
}