import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import PatientFilterBar from '../components/PatientFilterBar';
import PatientTable from '../components/PatientTable';
import PatientFormDialog from '../components/PatientFormDialog';
import { Patient } from '../types/patient';

const INITIAL_PATIENTS: Patient[] = [
  { patient_id: 1001, full_name: 'Liam Anderson', gender: 'Male', date_of_birth: '1985-06-15', phone: '+1 (555) 123-4567', address: '123 Main St, NY' },
  { patient_id: 1002, full_name: 'Emma Watson', gender: 'Female', date_of_birth: '1992-11-03', phone: '+1 (555) 987-6543', address: '456 Oak Ave, CA' },
];

export default function PatientList() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null);

  const handleFormSubmit = (formData: any, isEdit: boolean) => {
    if (isEdit) {
      setPatients(patients.map(p => p.patient_id === selectedPatient?.patient_id ? { ...p, ...formData } : p));
    } else {
      setPatients([{ ...formData, patient_id: Date.now() }, ...patients]);
    }
    setIsFormOpen(false);
  };

  const filteredPatients = patients.filter(p => 
    p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.phone.includes(searchTerm) ||
    p.patient_id.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <PageHeader 
        title="Patient Directory" 
        description="Manage patient profiles, demographics, and contact information." 
        actionText="Add Patient" 
        onAction={() => { setSelectedPatient(null); setIsFormOpen(true); }} 
      />

      <PatientFilterBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <PatientTable 
        data={filteredPatients} 
        onViewDetails={(id) => navigate(`/patients/${id}`)}
        onEdit={(patient) => { setSelectedPatient(patient); setIsFormOpen(true); }} 
        onDelete={(patient) => setDeletingPatient(patient)}
      />

      <PatientFormDialog 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleFormSubmit} 
        initialData={selectedPatient} 
      />
      
      <ConfirmDialog 
        isOpen={!!deletingPatient} 
        onClose={() => setDeletingPatient(null)} 
        onConfirm={() => { setPatients(patients.filter(p => p.patient_id !== deletingPatient?.patient_id)); setDeletingPatient(null); }} 
        title="Delete Patient" 
        description={`Are you sure you want to permanently delete the records for ${deletingPatient?.full_name}?`} 
        confirmText="Yes, Delete"
      />
    </div>
  );
}