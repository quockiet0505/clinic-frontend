import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import LabResultsFilterBar from '../components/LabResultsFilterBar';
import LabResultsTable from '../components/LabResultsTable';
import LabResultDetailModal from '../components/LabResultDetailModal';
import { ServiceResult } from '../types/laboratory';

const TODAY = new Date().toISOString().split('T')[0];

export default function LabResults() {
  const [results] = useState<ServiceResult[]>([
    { result_id: 5003, order_id: 2, service_name: 'Lipid Panel', patient_name: 'William Garcia', doctor_name: 'Sarah Smith', result_data: 'LDL: 130 mg/dL\nHDL: 45 mg/dL', conclusion: 'Slightly elevated cholesterol.', entered_by: 3, entered_name: 'Tech John', entered_at: TODAY },
  ]);

  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState(TODAY);
  const [toDate, setToDate] = useState(TODAY);
  const [selectedResult, setSelectedResult] = useState<ServiceResult | null>(null);

  const filtered = results.filter(r => 
    r.patient_name.toLowerCase().includes(search.toLowerCase()) &&
    r.entered_at >= fromDate && r.entered_at <= toDate
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