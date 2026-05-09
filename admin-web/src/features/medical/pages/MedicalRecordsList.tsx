import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import MedicalRecordFilterBar from '../components/MedicalRecordFilterBar';
import MedicalRecordTable from '../components/MedicalRecordTable';
import { MedicalRecord } from '../types/medical';

export default function MedicalRecordsList() {
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState('2026-04-01');
  const [toDate, setToDate] = useState('2026-04-30');
  const [search, setSearch] = useState('');

  const [records] = useState<MedicalRecord[]>([
    { record_id: 901, patient_id: 101, patient_name: 'Olivia Davis', main_doctor_id: 1, doctor_name: 'Dr. Sarah Smith', diagnosis: 'Acute Bronchitis', treatment: '', note: '', status: 'DONE', created_at: '2026-04-20' },
    { record_id: 902, patient_id: 102, patient_name: 'Liam Anderson', main_doctor_id: 2, doctor_name: 'Dr. Robert Davis', diagnosis: 'Essential Hypertension', treatment: '', note: '', status: 'DONE', created_at: '2026-04-25' },
  ]);

  const filteredData = records.filter(rec => 
    rec.patient_name.toLowerCase().includes(search.toLowerCase()) &&
    rec.created_at >= fromDate && rec.created_at <= toDate
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <PageHeader title="Visit Archive" description="Search and review past medical records (DONE/CANCELLED)." />
      <MedicalRecordFilterBar search={search} setSearch={setSearch} fromDate={fromDate} toDate={toDate} setFromDate={setFromDate} setToDate={setToDate} />
      <MedicalRecordTable data={filteredData} onViewDetail={(id) => navigate(`/medical/records/${id}`)} />
    </div>
  );
}