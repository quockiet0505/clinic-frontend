// features/medical/pages/MedicalRecordsList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Archive, CheckCircle, XCircle } from 'lucide-react';
import { MedicalRecordFilterBar } from '../components/MedicalRecordFilterBar';
import MedicalRecordTable from '../components/MedicalRecordTable';
import { MedicalRecord } from '../types/medical';
import { medicalApi } from '../api/medicalApi';
import { staffApi } from '@/features/staffs/api/staffApi';
import PageHeader from '@/components/common/PageHeader';

export default function MedicalRecordsList() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [loading, setLoading] = useState(true);
  const [doctorMap, setDoctorMap] = useState<Record<string, number>>({});

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [doctorFilter, setDoctorFilter] = useState('ALL');

  useEffect(() => {
    staffApi.getAll().then((staff) => {
      const map: Record<string, number> = {};
      staff.filter((s) => s.staffType === 'DOCTOR').forEach((s) => { map[s.fullName] = s.staffId; });
      setDoctorMap(map);
    });
  }, []);

  const doctorOptions = Object.keys(doctorMap).map((name) => ({ value: name, label: name }));

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await medicalApi.getRecordsPaged({
        search: search || undefined,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        doctorId: doctorFilter === 'ALL' ? undefined : doctorMap[doctorFilter],
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        tab: 'archived',
        page: currentPage - 1,
        size: pageSize,
        sortBy: 'createdAt',
        sortDir: 'DESC',
      });
      setRecords(res.content);
      setTotalElements(res.totalElements);
    } catch {
      setRecords([]);
      setTotalElements(0);
    }
    setLoading(false);
  }, [search, statusFilter, doctorFilter, fromDate, toDate, currentPage, doctorMap]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, doctorFilter, fromDate, toDate]);

  const done = records.filter((r) => r.status === 'DONE').length;
  const cancelled = records.filter((r) => r.status === 'CANCELLED').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader title="Lưu trữ bệnh án" description="Tìm kiếm và xem lại các hồ sơ bệnh án cũ." />
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center font-bold">
              <CheckCircle size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Hoàn thành (trang)</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{done}</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center font-bold">
              <XCircle size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Đã hủy (trang)</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{cancelled}</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold">
              <Archive size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Tổng lưu trữ</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{totalElements}</p>
            </div>
          </div>
        </div>
      </div>

      <MedicalRecordFilterBar
        search={search}
        onSearchChange={setSearch}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        doctor={doctorFilter}
        onDoctorChange={setDoctorFilter}
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        doctorOptions={doctorOptions}
      />

      <div className="flex-1 min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <MedicalRecordTable
          data={records}
          loading={loading}
          onViewDetail={(id) => navigate(`/medical/records/${id}`)}
          pagination={{ page: currentPage, size: pageSize, total: totalElements, onPageChange: setCurrentPage }}
        />
      </div>
    </div>
  );
}
