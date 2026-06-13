import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import PrescriptionFilterBar from '../components/PrescriptionFilterBar';
import PrescriptionTable from '../components/PrescriptionTable';
import DispenseRxDialog from '../components/DispenseRxDialog';
import { PrescriptionUI } from '../types/pharmacy';

const TODAY = new Date().toISOString().split('T')[0];

export default function PrescriptionDispense() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionUI[]>([
    { prescription_id: 9001, record_id: 101, patient_name: 'Liam Anderson', doctor_name: 'Sarah Smith', created_at: TODAY, status: 'PENDING', items: [{ name: 'Amoxil 500mg', dosage: '1 pill 2x/day', qty: 14 }] },
    { prescription_id: 9002, record_id: 102, patient_name: 'Emma Watson', doctor_name: 'Robert Davis', created_at: TODAY, status: 'DISPENSED', items: [{ name: 'Panadol', dosage: 'As needed', qty: 20 }] }
  ]);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [fromDate, setFromDate] = useState(TODAY);
  const [toDate, setToDate] = useState(TODAY);
  const [selectedRx, setSelectedRx] = useState<PrescriptionUI | null>(null);

  const filtered = prescriptions.filter(rx => 
    (statusFilter === 'ALL' || rx.status === statusFilter) &&
    (rx.patient_name || '').toLowerCase().includes(search.toLowerCase()) &&
    (!fromDate || rx.created_at >= fromDate) && rx.created_at <= toDate
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <PageHeader title="Prescription Dispensary" description="Manage and fulfill electronic prescriptions from clinical staff." />
      <PrescriptionFilterBar search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter} fromDate={fromDate} toDate={toDate} setFromDate={setFromDate} setToDate={setToDate} />
      <PrescriptionTable data={filtered} onDispense={setSelectedRx} />
      <DispenseRxDialog prescription={selectedRx} onClose={() => setSelectedRx(null)} onConfirm={(id: number) => { setPrescriptions(prescriptions.map(rx => rx.prescription_id === id ? { ...rx, status: 'DISPENSED' } : rx)); setSelectedRx(null); }} />
    </div>
  );
}