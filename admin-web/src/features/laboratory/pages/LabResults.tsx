import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import LabResultsFilterBar from '../components/LabResultsFilterBar';
import LabResultsTable from '../components/LabResultsTable';
import LabResultDetailModal from '../components/LabResultDetailModal';
import { ServiceResult } from '../types/laboratory';

const TODAY = new Date().toISOString().split('T')[0];

export default function LabResults() {
  const [results] = useState<ServiceResult[]>([
    { resultId: 5003, orderId: 2, serviceName: 'Lipid Panel', patientName: 'William Garcia', doctorName: 'Sarah Smith', resultData: 'LDL: 130 mg/dL\nHDL: 45 mg/dL', conclusion: 'Slightly elevated cholesterol.', enteredBy: 3, enteredName: 'Tech John', enteredAt: TODAY },
  ]);

  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState(TODAY);
  const [toDate, setToDate] = useState(TODAY);
  const [selectedResult, setSelectedResult] = useState<ServiceResult | null>(null);

  const filtered = results.filter(r => 
    r.patientName.toLowerCase().includes(search.toLowerCase()) &&
    r.enteredAt >= fromDate && r.enteredAt <= toDate
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <PageHeader title="Laboratory Archive" description="Search and view finalized lab reports." />
      <LabResultsFilterBar search={search} setSearch={setSearch} fromDate={fromDate} toDate={toDate} setFromDate={setFromDate} setToDate={setToDate} />
      <LabResultsTable data={filtered} onViewResult={setSelectedResult} />
      <LabResultDetailModal result={selectedResult} onClose={() => setSelectedResult(null)} />
    </div>
  );
}