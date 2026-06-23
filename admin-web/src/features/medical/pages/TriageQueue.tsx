// features/medical/pages/ActiveVisits.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, CheckCircle, Hourglass } from 'lucide-react';
import { ActiveVisitsFilterBar } from '../components/ActiveVisitsFilterBar';
import ActiveVisitsTable from '../components/ActiveVisitsTable';
import { MedicalRecord } from '../types/medical';
import { medicalApi } from '../api/medicalApi';
import { staffApi } from '@/features/staffs/api/staffApi';
import PageHeader from '@/components/common/PageHeader';

export default function TriageQueue() {
  const navigate = useNavigate();
  const [visits, setVisits] = useState<MedicalRecord[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [loading, setLoading] = useState(true);
  const [doctorMap, setDoctorMap] = useState<Record<string, number>>({});

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [doctorFilter, setDoctorFilter] = useState('ALL');
  const [search, setSearch] = useState('');

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
      const res = await medicalApi.getActiveVisitsPaged({
        search: search || undefined,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        doctorId: doctorFilter === 'ALL' ? undefined : doctorMap[doctorFilter],
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        page: currentPage - 1,
        size: pageSize,
        sortBy: 'createdAt',
        sortDir: 'DESC',
      });
      setVisits(res.content);
      setTotalElements(res.totalElements);
    } catch {
      setVisits([]);
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

  const inProgress = visits.filter((v) => v.status === 'IN_PROGRESS').length;
  const waitingResult = visits.filter((v) => v.status === 'WAITING_RESULT').length;
  const done = visits.filter((v) => v.status === 'DONE').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader title="Chuẩn bị khám (Đo sinh hiệu)" description="Danh sách bệnh nhân đang chờ đo sinh hiệu và ghi nhận tiền sử bệnh." />
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold">
              <Activity size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Đang khám (trang)</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{inProgress}</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center font-bold">
              <Hourglass size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Chờ kết quả (trang)</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{waitingResult}</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center font-bold">
              <CheckCircle size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Tổng (server)</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{totalElements}</p>
            </div>
          </div>
        </div>
      </div>

      <ActiveVisitsFilterBar
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
        <ActiveVisitsTable
          data={visits}
          loading={loading}
          onTriage={(id) => navigate(`/medical/triage/${id}`)}
          pagination={{ page: currentPage, size: pageSize, total: totalElements, onPageChange: setCurrentPage }}
        />
      </div>
    </div>
  );
}
