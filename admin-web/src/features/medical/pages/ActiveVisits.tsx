import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import ActiveVisitsFilterBar from '../components/ActiveVisitsFilterBar';
import ActiveVisitsTable from '../components/ActiveVisitsTable';
import CustomSelect from '@/components/common/CustomSelect';
import { MedicalRecord } from '../types/medical';

const TODAY = new Date().toISOString().split('T')[0];

import { medicalApi } from '../api/medicalApi';

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

  const filteredData = visits.filter(visit => {
    const matchesDate = (!fromDate || visit.createdAt >= fromDate) && (!toDate || visit.createdAt <= toDate);
    const matchesStatus = statusFilter === 'ALL' || visit.status === statusFilter;
    const matchesDoctor = doctorFilter === 'ALL' || visit.doctorName === doctorFilter;
    const matchesSearch = visit.patientName.toLowerCase().includes(search.toLowerCase());
    return matchesDate && matchesStatus && matchesDoctor && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <PageHeader title="Đang khám bệnh" description="Quản lý hàng đợi bệnh nhân và hồ sơ bệnh án.">
        <CustomSelect value={doctorFilter} onChange={(e) => setDoctorFilter(e.target.value)} className="h-11 w-full sm:w-40 text-sm font-bold text-slate-600">
          <option value="ALL">Tất cả Bác sĩ</option>
          <option value="Dr. Sarah Smith">Dr. Sarah Smith</option>
          <option value="Dr. Robert Davis">Dr. Robert Davis</option>
        </CustomSelect>

        <CustomSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-11 w-full sm:w-40 text-sm font-bold text-slate-600">
          <option value="ALL">Tất cả Trạng thái</option>
          <option value="PENDING">Chờ khám</option>
          <option value="IN_PROGRESS">Đang khám</option>
          <option value="WAITING_RESULT">Chờ kết quả</option>
          <option value="DONE">Hoàn thành</option>
          <option value="CANCELLED">Đã hủy</option>
        </CustomSelect>
      </PageHeader>

      <ActiveVisitsFilterBar 
        search={search} setSearch={setSearch}
        fromDate={fromDate} toDate={toDate} setFromDate={setFromDate} setToDate={setToDate}
      />

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Đang tải danh sách...</div>
      ) : (
        <ActiveVisitsTable data={filteredData} onConsult={(id) => navigate(`/medical/consultation/${id}`)} />
      )}
    </div>
  );
}