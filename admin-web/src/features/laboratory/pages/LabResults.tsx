// features/laboratory/pages/LabResults.tsx
import React, { useState } from 'react';
import { Activity, AlertTriangle } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { LabResultsFilterBar } from '../components/LabResultsFilterBar';
import LabResultsTable from '../components/LabResultsTable';
import LabResultDetail from './LabResultDetail';
import { ServiceResult } from '../types/laboratory';
import { laboratoryApi } from '../api/laboratoryApi';

export default function LabResults() {
  const [results, setResults] = useState<ServiceResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedResult, setSelectedResult] = useState<ServiceResult | null>(null);

  React.useEffect(() => {
    laboratoryApi.getLabResults().then(data => {
      setResults(data);
      setLoading(false);
    });
  }, []);

  if (selectedResult !== null) {
    return (
      <LabResultDetail 
        result={selectedResult} 
        onBack={() => setSelectedResult(null)} 
      />
    );
  }

  const filtered = results.filter(r => 
    (r.patientName || '').toLowerCase().includes(search.toLowerCase()) &&
    (!fromDate || r.enteredAt >= fromDate) && (!toDate || r.enteredAt <= toDate)
  );

  // Stats
  const total = results.length;
  const abnormal = results.filter(r => r.isAbnormal === true).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader 
          title="Lưu trữ Xét nghiệm" 
          description="Tìm kiếm và xem các báo cáo xét nghiệm đã hoàn tất." 
          hideActions
        />
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold">
              <Activity size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Tổng kết quả</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{total}</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center font-bold">
              <AlertTriangle size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Bất thường</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{abnormal}</p>
            </div>
          </div>
        </div>
      </div>

      <LabResultsFilterBar
        search={search}
        onSearchChange={setSearch}
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
      />

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Đang tải báo cáo...</div>
      ) : (
        <LabResultsTable data={filtered} onViewResult={setSelectedResult} />
      )}
    </div>
  );
}