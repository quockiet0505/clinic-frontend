// features/pharmacy/pages/PrescriptionDispense.tsx
import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle } from 'lucide-react';
import { pharmacyApi } from '../api/pharmacyApi';
import { PrescriptionUI } from '../types/pharmacy';
import { PrescriptionFilterBar } from '../components/PrescriptionFilterBar';
import PrescriptionTable from '../components/PrescriptionTable';
import PrescriptionDetail from './PrescriptionDetail';
import PageHeader from '@/components/common/PageHeader';

export default function PrescriptionDispense() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const data = await pharmacyApi.getPrescriptions();
      setPrescriptions(data);
    } catch (error) {
      console.error("Lỗi lấy đơn thuốc:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  if (selectedId !== null) {
    return (
      <PrescriptionDetail 
        prescriptionId={selectedId} 
        onBack={() => setSelectedId(null)}
        onDispensed={fetchPrescriptions}
      />
    );
  }

  const filteredData = prescriptions.filter(rx => {
    const matchSearch = rx.patientName.toLowerCase().includes(search.toLowerCase()) || rx.prescriptionId.toString().includes(search);
    const matchStatus = statusFilter === 'ALL' || rx.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Stats
  const total = prescriptions.length;
  const pending = prescriptions.filter(rx => rx.status === 'PENDING').length;
  const dispensed = prescriptions.filter(rx => rx.status === 'DISPENSED').length;

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <PageHeader title="Quản lý Đơn Thuốc" description="Kiểm tra và phát thuốc cho bệnh nhân"></PageHeader>

        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold">
              <FileText size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Tổng đơn</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{total}</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center font-bold">
              <Clock size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Chờ phát</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{pending}</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center font-bold">
              <CheckCircle size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Đã phát</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{dispensed}</p>
            </div>
          </div>
        </div>
      </div>

      <PrescriptionFilterBar
        search={search}
        onSearchChange={setSearch}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
      />

      <div className="flex-1 min-h-0">
        {loading ? (
          <div className="flex justify-center items-center h-full bg-white rounded-2xl border border-slate-200">
            <span className="text-slate-400 font-medium">Đang tải dữ liệu...</span>
          </div>
        ) : (
          <PrescriptionTable 
            data={filteredData} 
            onViewDetails={(id) => setSelectedId(Number(id))} 
          />
        )}
      </div>
    </div>
  );
}