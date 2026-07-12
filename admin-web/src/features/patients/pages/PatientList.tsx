// features/patients/pages/PatientList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { PatientFilterBar } from '../components/PatientFilterBar';
import PatientTable from '../components/PatientTable';
import PatientFormDialog from '../components/PatientFormDialog';
import GradientButton from '@/components/common/GradientButton';
import { Patient } from '../types/patient';
import { patientApi } from '../api/patientApi';

export default function PatientList() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genderTab, setGenderTab] = useState('ALL');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null);
  const [togglingPatient, setTogglingPatient] = useState<Patient | null>(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await patientApi.getAllPaged({
        search: search || undefined,
        gender: genderTab === 'ALL' ? undefined : genderTab,
        page: currentPage - 1,
        size: pageSize,
        sortBy: 'fullName',
        sortDir: 'ASC',
      });
      setPatients(res.content);
      setTotalElements(res.totalElements);
    } catch {
      setPatients([]);
      setTotalElements(0);
    }
    setLoading(false);
  }, [search, genderTab, currentPage]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, genderTab]);

  const handleFormSubmit = async (formData: unknown, isEdit: boolean) => {
    try {
      if (isEdit) {
        await patientApi.update(selectedPatient!.patientId, formData as Partial<Patient>);
      } else {
        await patientApi.create(formData as Omit<Patient, 'patientId'>);
      }
      await fetchPatients();
      setIsFormOpen(false);
    } catch {
      /* toast: axios interceptor */
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader title="Danh sách Bệnh nhân" description="Quản lý hồ sơ bệnh nhân và thông tin liên lạc." />
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold">
              <Users size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Tổng bệnh nhân</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{totalElements}</p>
            </div>
          </div>
          <GradientButton onClick={() => { setSelectedPatient(null); setIsFormOpen(true); }} className="w-full sm:w-auto">
            <Plus size={18} className="mr-2" /> Thêm bệnh nhân
          </GradientButton>
        </div>
      </div>

      <PatientFilterBar search={search} onSearchChange={setSearch} genderTab={genderTab} onGenderTabChange={setGenderTab} />

      <div className="flex-1 min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <PatientTable
          data={patients}
          loading={loading}
          onViewDetails={(id) => navigate(`/patients/${id}`)}
          onEdit={(patient) => { setSelectedPatient(patient); setIsFormOpen(true); }}
          onDelete={(patient) => setDeletingPatient(patient)}
          onUnlockBooking={async (patient) => {
            if (confirm(`Bạn có chắc chắn muốn mở khóa đặt lịch cho bệnh nhân ${patient.fullName}?`)) {
              try {
                await patientApi.unlockBooking(patient.patientId);
                fetchPatients();
              } catch (e) {
                console.error(e);
              }
            }
          }}
          onToggleAccountStatus={(patient) => setTogglingPatient(patient)}
          pagination={{ page: currentPage, size: pageSize, total: totalElements, onPageChange: setCurrentPage }}
        />
      </div>

      <PatientFormDialog isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} initialData={selectedPatient} />

      <ConfirmDialog
        isOpen={!!deletingPatient}
        onClose={() => setDeletingPatient(null)}
        onConfirm={async () => {
          if (deletingPatient) {
            try {
              await patientApi.delete(deletingPatient.patientId);
              await fetchPatients();
            } catch {
              /* toast: axios interceptor */
            }
          }
          setDeletingPatient(null);
        }}
        title="Xóa Bệnh Nhân"
        description={`Bạn có chắc chắn muốn xóa hồ sơ của ${deletingPatient?.fullName} không?`}
        confirmText="Xác nhận xóa"
      />

      <ConfirmDialog
        isOpen={!!togglingPatient}
        onClose={() => setTogglingPatient(null)}
        onConfirm={async () => {
          if (togglingPatient?.accountId) {
            const newStatus = togglingPatient.isActive === 0 ? 1 : 0;
            try {
              await patientApi.updateAccountStatus(togglingPatient.accountId, newStatus);
              await fetchPatients();
            } catch (e) {
              console.error(e);
            }
          }
          setTogglingPatient(null);
        }}
        title={togglingPatient?.isActive === 0 ? "Mở Khóa Tài Khoản" : "Khóa Tài Khoản"}
        description={`Bạn có chắc chắn muốn ${togglingPatient?.isActive === 0 ? 'mở khóa' : 'khóa'} tài khoản của bệnh nhân ${togglingPatient?.fullName} không?`}
        confirmText="Xác nhận"
      />
    </div>
  );
}
