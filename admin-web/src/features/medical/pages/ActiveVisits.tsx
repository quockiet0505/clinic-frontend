import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import ActiveVisitsFilterBar from '../components/ActiveVisitsFilterBar';
import ActiveVisitsTable from '../components/ActiveVisitsTable';
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
    const matchesDate = (!fromDate || visit.created_at >= fromDate) && (!toDate || visit.created_at <= toDate);
    const matchesStatus = statusFilter === 'ALL' || visit.status === statusFilter;
    const matchesDoctor = doctorFilter === 'ALL' || visit.doctor_name === doctorFilter;
    const matchesSearch = visit.patient_name.toLowerCase().includes(search.toLowerCase());
    return matchesDate && matchesStatus && matchesDoctor && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <PageHeader title="Active Consultations" description="Manage live patient queue and medical records." />

      <ActiveVisitsFilterBar 
        search={search} setSearch={setSearch}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        doctorFilter={doctorFilter} setDoctorFilter={setDoctorFilter}
        fromDate={fromDate} toDate={toDate} setFromDate={setFromDate} setToDate={setToDate}
      />

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Loading active visits...</div>
      ) : (
        <ActiveVisitsTable data={filteredData} onConsult={(id) => navigate(`/medical/consultation/${id}`)} />
      )}
    </div>
  );
}