import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import PrescriptionFilterBar from '../components/PrescriptionFilterBar';
import PrescriptionTable from '../components/PrescriptionTable';
import DispenseRxDialog from '../components/DispenseRxDialog';
import { PrescriptionUI } from '../types/pharmacy';
import { pharmacyApi } from '../api/pharmacyApi';

const TODAY = new Date().toISOString().split('T')[0];

export default function PrescriptionDispense() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionUI[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    pharmacyApi.getPrescriptions().then(data => {
      if (data && data.length > 0) {
        setPrescriptions(data);
      } else {
        setPrescriptions([
          { prescriptionId: 101, recordId: 1, patientName: 'Nguyễn Văn A', doctorName: 'BS. Lê Văn B', createdAt: TODAY, status: 'PENDING', items: [] },
          { prescriptionId: 102, recordId: 2, patientName: 'Trần Thị C', doctorName: 'BS. Phạm Thị D', createdAt: TODAY, status: 'DISPENSED', items: [] }
        ]);
      }
      setLoading(false);
    }).catch(() => {
      setPrescriptions([
        { prescriptionId: 101, recordId: 1, patientName: 'Nguyễn Văn A', doctorName: 'BS. Lê Văn B', createdAt: TODAY, status: 'PENDING', items: [] }
      ]);
      setLoading(false);
    });
  }, []);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedRx, setSelectedRx] = useState<PrescriptionUI | null>(null);

  const filtered = prescriptions.filter(rx => 
    (statusFilter === 'ALL' || rx.status === statusFilter) &&
    (rx.patientName || '').toLowerCase().includes(search.toLowerCase()) &&
    (!fromDate || rx.createdAt >= fromDate) && rx.createdAt <= toDate
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <PageHeader title="Phát thuốc" description="Quản lý và cấp phát đơn thuốc điện tử từ bác sĩ." />
      <PrescriptionFilterBar search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter} fromDate={fromDate} toDate={toDate} setFromDate={setFromDate} setToDate={setToDate} />
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Đang tải đơn thuốc...</div>
      ) : (
        <PrescriptionTable data={filtered} onDispense={setSelectedRx} />
      )}
      <DispenseRxDialog prescription={selectedRx} onClose={() => setSelectedRx(null)} onConfirm={(id: number) => { setPrescriptions(prescriptions.map(rx => rx.prescriptionId === id ? { ...rx, status: 'DISPENSED' } : rx)); setSelectedRx(null); }} />
    </div>
  );
}