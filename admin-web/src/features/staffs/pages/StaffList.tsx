import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import StaffFilterBar from '../components/StaffFilterBar';
import StaffTable from '../components/StaffTable';
import StaffFormDialog from '../components/StaffFormDialog';
import { Staff } from '../types/staff';

const INITIAL_STAFF: Staff[] = [
  { staff_id: 1, full_name: 'Dr. Sarah Smith', email: 'sarah@clinic.vn', phone: '+1 555-1111', staff_type: 'DOCTOR', expertise_name: 'Cardiology', is_active: true },
  { staff_id: 2, full_name: 'Michael Chen', email: 'm.chen@clinic.vn', phone: '+1 555-2222', staff_type: 'ADMIN', is_active: true },
];

export default function StaffList() {
  const [staffList, setStaffList] = useState<Staff[]>(INITIAL_STAFF);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<Staff | null>(null);

  const handleFormSubmit = (formData: any, isEdit: boolean) => {
    if (isEdit) setStaffList(staffList.map(s => s.staff_id === selectedStaff?.staff_id ? { ...s, ...formData } : s));
    else setStaffList([{ ...formData, staff_id: Date.now() }, ...staffList]);
    setIsFormOpen(false);
  };

  const filteredStaff = staffList.filter(s => {
    const matchSearch = s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTab = activeTab === 'ALL' || s.staff_type === activeTab;
    return matchSearch && matchTab;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <PageHeader title="Staff Directory" description="Manage clinic personnel across all departments." actionText="Add Member" onAction={() => { setSelectedStaff(null); setIsFormOpen(true); }} />
      <StaffFilterBar activeTab={activeTab} setActiveTab={setActiveTab} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <StaffTable data={filteredStaff} onEdit={(s) => { setSelectedStaff(s); setIsFormOpen(true); }} onDelete={setDeletingStaff} />
      <StaffFormDialog isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} initialData={selectedStaff} />
      <ConfirmDialog isOpen={!!deletingStaff} onClose={() => setDeletingStaff(null)} onConfirm={() => { setStaffList(staffList.filter(s => s.staff_id !== deletingStaff?.staff_id)); setDeletingStaff(null); }} title="Delete Staff Member" description={`Are you sure you want to remove ${deletingStaff?.full_name}?`} />
    </div>
  );
}