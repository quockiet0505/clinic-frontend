// features/medical/pages/ActiveVisits.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Clock, CheckCircle, Hourglass } from 'lucide-react';
import { ActiveVisitsFilterBar } from '../components/ActiveVisitsFilterBar';
import ActiveVisitsTable from '../components/ActiveVisitsTable';
import { MedicalRecord } from '../types/medical';
import { medicalApi } from '../api/medicalApi';
import PageHeader from '@/components/common/PageHeader';

export default function ActiveVisits() {
  const navigate = useNavigate();

  const [visits, setVisits] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    medicalApi.getActiveVisits().then(data => {
      setVisits(data);
      setLoading(false);
    });
  }, []);

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [doctorFilter, setDoctorFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const doctorOptions = React.useMemo(() => {
    const doctors = Array.from(new Set(visits.map(v => v.doctorName).filter(Boolean)));
    return doctors.map(name => ({ value: name, label: name }));
  }, [visits]);

  const stats = React.useMemo(() => {
    const inProgress = visits.filter(v => v.status === 'IN_PROGRESS').length;
    const waitingResult = visits.filter(v => v.status === 'WAITING_RESULT').length;
    const done = visits.filter(v => v.status === 'DONE').length;
    const pending = visits.filter(v => v.status === 'PENDING').length;
    return { inProgress, waitingResult, done, pending };
  }, [visits]);

  const filteredData = visits.filter(visit => {
    const matchesDate = (!fromDate || visit.createdAt >= fromDate) && (!toDate || visit.createdAt <= toDate);
    const matchesStatus = statusFilter === 'ALL' || visit.status === statusFilter;
    const matchesDoctor = doctorFilter === 'ALL' || visit.doctorName === doctorFilter;
    const matchesSearch = visit.patientName.toLowerCase().includes(search.toLowerCase());
    return matchesDate && matchesStatus && matchesDoctor && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader title="Đang khám bệnh" description="Quản lý hàng đợi bệnh nhân và hồ sơ bệnh án."></PageHeader>
              
       
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold">
              <Activity size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Đang khám</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{stats.inProgress} bệnh nhân</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center font-bold">
              <Hourglass size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Chờ kết quả</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{stats.waitingResult} bệnh nhân</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center font-bold">
              <CheckCircle size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Hoàn thành</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{stats.done} bệnh nhân</p>
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

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Đang tải danh sách...</div>
      ) : (
        <ActiveVisitsTable 
          data={filteredData} 
          onConsult={(id) => navigate(`/medical/consultation/${id}`)} 
        />
      )}
    </div>
  );
}