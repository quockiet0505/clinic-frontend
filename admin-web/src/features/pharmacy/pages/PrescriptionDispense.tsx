// features/pharmacy/pages/PrescriptionDispense.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Clock, CheckCircle } from 'lucide-react';
import { pharmacyApi } from '../api/pharmacyApi';
import { PrescriptionUI } from '../types/pharmacy';
import { PrescriptionFilterBar } from '../components/PrescriptionFilterBar';
import PrescriptionTable from '../components/PrescriptionTable';
import PrescriptionDetail from './PrescriptionDetail';
import PageHeader from '@/components/common/PageHeader';

export default function PrescriptionDispense() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionUI[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const fetchPrescriptions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await pharmacyApi.getPrescriptionsPaged({
        search: search || undefined,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        page: currentPage - 1,
        size: pageSize,
        sortBy: 'createdAt',
        sortDir: 'DESC',
      });
      setPrescriptions(res.content);
      setTotalElements(res.totalElements);
    } catch (error) {
      console.error('Lỗi lấy đơn thuốc:', error);
      setPrescriptions([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, fromDate, toDate, currentPage]);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, fromDate, toDate]);

  if (selectedId !== null) {
    return (
      <PrescriptionDetail
        prescriptionId={selectedId}
        onBack={() => setSelectedId(null)}
        onDispensed={fetchPrescriptions}
      />
    );
  }

  const pending = prescriptions.filter((rx) => rx.status === 'PENDING').length;
  const dispensed = prescriptions.filter((rx) => rx.status === 'DISPENSED').length;

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader title="Quản lý Đơn Thuốc" description="Kiểm tra và phát thuốc cho bệnh nhân" />
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold"><FileText size={16} /></div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Tổng đơn</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{totalElements}</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center font-bold"><Clock size={16} /></div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Chờ phát (trang)</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{pending}</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center font-bold"><CheckCircle size={16} /></div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Đã phát (trang)</p>
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

      <div className="flex-1 min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <PrescriptionTable
          data={prescriptions}
          loading={loading}
          onViewDetails={(id) => setSelectedId(Number(id))}
          pagination={{ page: currentPage, size: pageSize, total: totalElements, onPageChange: setCurrentPage }}
        />
      </div>
    </div>
  );
}
