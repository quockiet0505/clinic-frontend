import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import MedicalRecordFilterBar from '../components/MedicalRecordFilterBar';
import MedicalRecordTable from '../components/MedicalRecordTable';
import { MedicalRecord } from '../types/medical';

import { medicalApi } from '../api/medicalApi';

export default function MedicalRecordsList() {
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [search, setSearch] = useState('');

  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    medicalApi.getRecords().then(data => {
      // Filter out only DONE/CANCELLED records if needed, or let the backend do it.
      // Usually "MedicalRecordsList" is for past records (DONE, CANCELLED).
      // ActiveVisits handles IN_PROGRESS, WAITING_RESULT.
      const pastRecords = data.filter(r => ['DONE', 'CANCELLED'].includes(r.status));
      setRecords(pastRecords);
      setLoading(false);
    });
  }, []);

  const filteredData = records.filter(rec => 
    rec.patientName.toLowerCase().includes(search.toLowerCase()) &&
    (!fromDate || rec.createdAt >= fromDate) && 
    (!toDate || rec.createdAt <= toDate)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <PageHeader title="Lưu trữ bệnh án" description="Tìm kiếm và xem lại các hồ sơ bệnh án cũ (Hoàn thành / Đã hủy)." />
      <MedicalRecordFilterBar search={search} setSearch={setSearch} fromDate={fromDate} toDate={toDate} setFromDate={setFromDate} setToDate={setToDate} />
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Đang tải hồ sơ...</div>
      ) : (
        <MedicalRecordTable data={filteredData} onViewDetail={(id) => navigate(`/medical/records/${id}`)} />
      )}
    </div>
  );
}