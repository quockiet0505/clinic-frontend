// features/medical/pages/MedicalRecordsList.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Archive, CheckCircle, XCircle } from 'lucide-react';
import { MedicalRecordFilterBar } from '../components/MedicalRecordFilterBar';
import MedicalRecordTable from '../components/MedicalRecordTable';
import { MedicalRecord } from '../types/medical';
import { medicalApi } from '../api/medicalApi';
import PageHeader from '@/components/common/PageHeader';

export default function MedicalRecordsList() {
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [doctorFilter, setDoctorFilter] = useState('ALL');

  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    medicalApi.getRecords().then(data => {
      const pastRecords = data.filter(r => ['DONE', 'CANCELLED'].includes(r.status));
      setRecords(pastRecords);
      setLoading(false);
    });
  }, []);

  const doctorOptions = React.useMemo(() => {
    const doctors = Array.from(new Set(records.map(r => r.doctorName).filter(Boolean)));
    return doctors.map(name => ({ value: name, label: name }));
  }, [records]);

  const stats = React.useMemo(() => {
    const total = records.length;
    const done = records.filter(r => r.status === 'DONE').length;
    const cancelled = records.filter(r => r.status === 'CANCELLED').length;
    return { total, done, cancelled };
  }, [records]);

  const filteredData = records.filter(rec => {
    const matchesSearch = rec.patientName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || rec.status === statusFilter;
    const matchesDoctor = doctorFilter === 'ALL' || rec.doctorName === doctorFilter;
    const matchesDate = (!fromDate || rec.createdAt >= fromDate) && (!toDate || rec.createdAt <= toDate);
    return matchesSearch && matchesStatus && matchesDoctor && matchesDate;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader title="Lưu trữ bệnh án" description="Tìm kiếm và xem lại các hồ sơ bệnh án cũ."></PageHeader>
              
      
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center font-bold">
              <CheckCircle size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Hoàn thành</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{stats.done} hồ sơ</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center font-bold">
              <XCircle size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Đã hủy</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{stats.cancelled} hồ sơ</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold">
              <Archive size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Tổng lưu trữ</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{stats.total} hồ sơ</p>
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

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Đang tải hồ sơ...</div>
      ) : (
        <MedicalRecordTable 
          data={filteredData} 
          onViewDetail={(id) => navigate(`/medical/records/${id}`)} 
        />
      )}
    </div>
  );
}