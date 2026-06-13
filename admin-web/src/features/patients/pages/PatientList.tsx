import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import PatientFilterBar from '../components/PatientFilterBar';
import PatientTable from '../components/PatientTable';
import PatientFormDialog from '../components/PatientFormDialog';
import { Patient } from '../types/patient';
import { patientApi } from '../api/patientApi';

export default function PatientList() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
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

  const filteredPatients = patients.filter(p => 
    p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.phone.includes(searchTerm) ||
    p.patientId.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <PageHeader 
        title="Danh sách Bệnh nhân" 
        description="Quản lý hồ sơ bệnh nhân và thông tin liên lạc." 
        actionText="Thêm Bệnh nhân" 
        onAction={() => { setSelectedPatient(null); setIsFormOpen(true); }} 
      />

      <PatientFilterBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

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