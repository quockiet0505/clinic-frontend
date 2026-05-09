import React, { useState } from 'react';
import { History, Pill, ChevronLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Sử dụng lại Component Timeline từ thư mục patients
import PatientHistoryTimeline from '@/features/patients/components/PatientHistoryTimeline';

export default function MedicalRecordDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'timeline' | 'medications'>('timeline');

  // Mock data giả định cho record này
  const recordHistory = [{ record_id: Number(id), date: '2026-04-20', doctor: 'Dr. Sarah Smith', diagnosis: 'Acute Bronchitis', treatment: 'Prescribed inhaler.' }];

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto w-full flex flex-col h-full space-y-6">
        
        <div className="flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate(-1)} className="rounded-2xl h-11 w-11 p-0 text-slate-500 hover:bg-white shadow-sm border border-slate-200">
              <ChevronLeft size={22}/>
            </Button>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Clinical Archive</h1>
              <p className="text-sm text-slate-500 mt-1">Reviewing medical record details for <span className="font-bold text-blue-600">REC-{id}</span></p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-100 px-6 pt-2 bg-slate-50/50 shrink-0">
            <button onClick={() => setActiveTab('timeline')} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all border-b-2 ${activeTab === 'timeline' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              <History size={16} /> Record Notes
            </button>
            <button onClick={() => setActiveTab('medications')} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all border-b-2 ${activeTab === 'medications' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              <Pill size={16} /> Prescriptions
            </button>
          </div>

          <div className="p-6 flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
            {activeTab === 'timeline' && <PatientHistoryTimeline visits={recordHistory} />}
            {activeTab === 'medications' && <div className="text-slate-500 text-center p-8 font-bold">List of prescribed medications will display here.</div>}
          </div>
        </div>

      </div>
    </div>
  );
}