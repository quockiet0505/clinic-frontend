// features/laboratory/pages/LabResults.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Activity, AlertTriangle } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { LabResultsFilterBar } from '../components/LabResultsFilterBar';
import LabResultsTable from '../components/LabResultsTable';
import LabResultDetail from './LabResultDetail';
import { ServiceResult } from '../types/laboratory';
import { laboratoryApi } from '../api/laboratoryApi';

export default function LabResults() {
  const [results, setResults] = useState<ServiceResult[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedResult, setSelectedResult] = useState<ServiceResult | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await laboratoryApi.getLabResultsPaged({
        search: search || undefined,
        status: 'DONE',
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        page: currentPage - 1,
        size: pageSize,
        sortBy: 'enteredAt',
        sortDir: 'DESC',
      });
      setResults(res.content);
      setTotalElements(res.totalElements);
    } catch {
      setResults([]);
      setTotalElements(0);
    }
    setLoading(false);
  }, [search, fromDate, toDate, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, fromDate, toDate]);

  if (selectedResult !== null) {
    return <LabResultDetail result={selectedResult} onBack={() => setSelectedResult(null)} />;
  }

  const abnormal = results.filter((r) => (r as { isAbnormal?: boolean }).isAbnormal === true).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader title="Lưu trữ Xét nghiệm" description="Tìm kiếm và xem các báo cáo xét nghiệm đã hoàn tất." />
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold"><Activity size={16} /></div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Tổng kết quả</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{totalElements}</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center font-bold"><AlertTriangle size={16} /></div>
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

      <div className="flex-1 min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <LabResultsTable
          data={results}
          loading={loading}
          onViewResult={setSelectedResult}
          pagination={{ page: currentPage, size: pageSize, total: totalElements, onPageChange: setCurrentPage }}
        />
      </div>
    </div>
  );
}
