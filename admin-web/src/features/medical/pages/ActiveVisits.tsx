import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import ActiveVisitsFilterBar from '../components/ActiveVisitsFilterBar';
import ActiveVisitsTable from '../components/ActiveVisitsTable';
import { MedicalRecord } from '../types/medical';

const TODAY = new Date().toISOString().split('T')[0];

export default function ActiveVisits() {
  const navigate = useNavigate();

  const [visits] = useState<MedicalRecord[]>([
    { record_id: 1, patient_id: 101, appointment_id: 50, patient_name: 'Liam Anderson', main_doctor_id: 1, doctor_name: 'Dr. Sarah Smith', diagnosis: '', treatment: '', note: '', status: 'IN_PROGRESS', created_at: TODAY, queue_number: 1, checkin_time: '08:15 AM', vitals_taken: true },
    { record_id: 2, patient_id: 102, appointment_id: 51, patient_name: 'Emma Watson', main_doctor_id: 2, doctor_name: 'Dr. Robert Davis', diagnosis: '', treatment: '', note: '', status: 'WAITING_RESULT', created_at: TODAY, queue_number: 2, checkin_time: '08:45 AM', vitals_taken: false },
  ]);

  const [fromDate, setFromDate] = useState(TODAY);
  const [toDate, setToDate] = useState(TODAY);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [doctorFilter, setDoctorFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredData = visits.filter(visit => {
    const matchesDate = visit.created_at >= fromDate && visit.created_at <= toDate;
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

      <ActiveVisitsTable data={filteredData} onConsult={(id) => navigate(`/medical/consultation/${id}`)} />
    </div>
  );
}