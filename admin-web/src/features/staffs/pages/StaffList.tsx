import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import StaffFilterBar from '../components/StaffFilterBar';
import StaffTable from '../components/StaffTable';
import StaffFormDialog from '../components/StaffFormDialog';
import { Staff } from '../types/staff';
import { staffApi } from '../api/staffApi';

export default function StaffList() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<Staff | null>(null);

  const fetchStaff = async () => {
    setLoading(true);
    const data = await staffApi.getAll();
    setStaffList(data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchStaff();
  }, []);

  const handleFormSubmit = async (formData: any, isEdit: boolean) => {
    if (isEdit) await staffApi.update(selectedStaff!.staff_id, formData);
    else await staffApi.create(formData);
    await fetchStaff();
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
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Loading staff...</div>
      ) : (
        <StaffTable data={filteredStaff} onEdit={(s) => { setSelectedStaff(s); setIsFormOpen(true); }} onDelete={setDeletingStaff} />
      )}
      <StaffFormDialog isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} initialData={selectedStaff} />
      <ConfirmDialog isOpen={!!deletingStaff} onClose={() => setDeletingStaff(null)} onConfirm={async () => { 
        if (deletingStaff) {
          await staffApi.delete(deletingStaff.staff_id);
          await fetchStaff();
        }
        setDeletingStaff(null); 
      }} title="Delete Staff Member" description={`Are you sure you want to remove ${deletingStaff?.full_name}?`} />
    </div>
  );
}