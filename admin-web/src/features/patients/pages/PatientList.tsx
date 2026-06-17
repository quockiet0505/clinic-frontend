// features/patients/pages/PatientList.tsx
import React, { useState } from 'react';
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
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genderTab, setGenderTab] = useState('ALL');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null);

  const fetchPatients = async () => {
    setLoading(true);
    const data = await patientApi.getAll();
    setPatients(data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchPatients();
  }, []);

  const handleFormSubmit = async (formData: any, isEdit: boolean) => {
    if (isEdit) {
      await patientApi.update(selectedPatient!.patientId, formData);
    } else {
      await patientApi.create(formData);
    }
    await fetchPatients();
    setIsFormOpen(false);
  };

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      p.patientId.toString().includes(search);
    const matchesGender = genderTab === 'ALL' || p.gender === genderTab;
    return matchesSearch && matchesGender;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <PageHeader 
          title="Danh sách Bệnh nhân" 
          description="Quản lý hồ sơ bệnh nhân và thông tin liên lạc." 
          // Không truyền actionText để tự render nút bên ngoài
        />
        <div className="flex flex-wrap items-center gap-3">
          {/* Badge tổng bệnh nhân */}
          <div className="bg-white px-4 py-2 rounded-[20px] shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold">
              <Users size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Tổng bệnh nhân</p>
              <p className="text-sm font-black text-slate-900 leading-none mt-0.5">{patients.length}</p>
            </div>
          </div>
          {/* Nút Thêm bệnh nhân */}
          <GradientButton 
            onClick={() => { setSelectedPatient(null); setIsFormOpen(true); }}
            className="w-full sm:w-auto"
          >
            <Plus size={18} className="mr-2" /> Thêm bệnh nhân
          </GradientButton>
        </div>
      </div>

      <PatientFilterBar
        search={search}
        onSearchChange={setSearch}
        genderTab={genderTab}
        onGenderTabChange={setGenderTab}
      />

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Đang tải danh sách bệnh nhân...</div>
      ) : (
        <PatientTable 
          data={filteredPatients} 
          onViewDetails={(id) => navigate(`/patients/${id}`)}
          onEdit={(patient) => { setSelectedPatient(patient); setIsFormOpen(true); }} 
          onDelete={(patient) => setDeletingPatient(patient)}
        />
      )}

      <PatientFormDialog 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleFormSubmit} 
        initialData={selectedPatient} 
      />
      
      <ConfirmDialog 
        isOpen={!!deletingPatient} 
        onClose={() => setDeletingPatient(null)} 
        onConfirm={async () => { 
          if (deletingPatient) {
            await patientApi.delete(deletingPatient.patientId);
            await fetchPatients();
          }
          setDeletingPatient(null); 
        }} 
        title="Xóa Bệnh Nhân" 
        description={`Bạn có chắc chắn muốn xóa hồ sơ của ${deletingPatient?.fullName} không?`} 
        confirmText="Xác nhận xóa"
      />
    </div>
  );
}