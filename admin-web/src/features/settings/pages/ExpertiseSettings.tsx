import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import SearchInput from '@/components/common/SearchInput';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import ExpertiseTable from '../components/ExpertiseTable';
import ExpertiseFormDialog from '../components/ExpertiseFormDialog';
import { Expertise } from '../types/settings';

// FIX: Explicitly type the initial data to match Expertise interface
const INITIAL_DATA: Expertise[] = [
  { 
    expertise_id: 1, 
    expertise_name: 'General Practice', 
    description: 'Primary care.', 
    doctorCount: 4, 
    status: 'Active' // Valid literal
  },
  { 
    expertise_id: 2, 
    expertise_name: 'Cardiology', 
    description: 'Heart care.', 
    doctorCount: 2, 
    status: 'Active' 
  }
];

export default function ExpertiseSettings() {
  const [data, setData] = useState<Expertise[]>(INITIAL_DATA);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Expertise | null>(null);
  const [deleting, setDeleting] = useState<Expertise | null>(null);

  const filtered = data.filter(e => e.expertise_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 flex flex-col h-full animate-in fade-in duration-500">
      <PageHeader 
        title="Medical Specialties" 
        description="Manage departments and clinical expertise categories." 
        actionText="Add Specialty"
        onAction={() => setEditing({ expertise_id: 0, expertise_name: '', description: '', doctorCount: 0, status: 'Active' })}
      />

      <div className="bg-white p-3 rounded-2xl border border-slate-200 flex shadow-sm shrink-0">
        <SearchInput value={search} onChange={setSearch} placeholder="Search specialty name..." />
      </div>

      <ExpertiseTable 
        data={filtered} 
        onEdit={setEditing} 
        onDelete={(id) => setDeleting(data.find(e => e.expertise_id === id) || null)} 
      />
      
      <ExpertiseFormDialog 
        expertise={editing} 
        onClose={() => setEditing(null)} 
        onSave={(id: number, updated: any) => {
          // Logic to update state
          setEditing(null);
        }} 
      />
      
      <ConfirmDialog 
        isOpen={!!deleting} 
        onClose={() => setDeleting(null)} 
        onConfirm={() => {
          setData(data.filter(e => e.expertise_id !== deleting?.expertise_id));
          setDeleting(null);
        }} 
        title="Delete Specialty" 
        description={`Are you sure you want to delete "${deleting?.expertise_name}"?`} 
      />
    </div>
  );
}