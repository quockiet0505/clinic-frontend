import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import LabResultsFilterBar from '../components/LabResultsFilterBar';
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
  
  // Công tắc điều hướng hiển thị tại chỗ
  const [selectedResult, setSelectedResult] = useState<ServiceResult | null>(null);

  React.useEffect(() => {
    laboratoryApi.getLabResults().then(data => {
      setResults(data);
      setLoading(false);
    });
  }, []);

  // Nếu đang chọn một kết quả, ẩn bảng và hiển thị giao diện chi tiết phẳng
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

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <PageHeader title="Lưu trữ Xét nghiệm" description="Tìm kiếm và xem các báo cáo xét nghiệm đã hoàn tất." />
      <LabResultsFilterBar search={search} setSearch={setSearch} fromDate={fromDate} toDate={toDate} setFromDate={setFromDate} setToDate={setToDate} />
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Đang tải báo cáo...</div>
      ) : (
        <LabResultsTable data={filtered} onViewResult={setSelectedResult} />
      )}
    </div>
  );
}