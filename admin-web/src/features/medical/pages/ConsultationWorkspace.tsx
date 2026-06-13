import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ChevronLeft, UserCircle, Activity, ClipboardList, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';

import VitalSignsForm from '../components/VitalSignsForm';
import ConsultationForm from '../components/ConsultationForm';
import PrescriptionBuilder from '../components/PrescriptionBuilder';

export default function ConsultationWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'notes' | 'prescriptions'>('notes');

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col h-full space-y-6">
        
        {/* HEADER */}
        <div className="flex justify-between items-center bg-white p-2 rounded-[32px] border border-slate-200 shadow-sm shrink-0">
          <Button variant="ghost" onClick={() => navigate(-1)} className="font-bold text-slate-500 rounded-2xl h-11 hover:bg-slate-50">
            <ChevronLeft size={20} className="mr-1"/> Exit Workspace
          </Button>
          <div className="flex gap-3 pr-2">
            <Button variant="outline" className="font-bold border-slate-200 rounded-2xl h-11 px-6 cursor-pointer">Save Draft</Button>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg text-white font-black px-8 rounded-2xl h-11 shadow-lg shadow-blue-100 cursor-pointer">
              <Save size={18} className="mr-2"/> Complete Record
            </Button>
          </div>
        </div>

        {/* MASTER-DETAIL LAYOUT */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden pb-4">
          
          {/* LEFT: INFO & VITALS */}
          <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
            <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm shrink-0">
              <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-2">
                <UserCircle size={18} className="text-blue-600" />
                <h2 className="font-black text-slate-800 uppercase text-[11px] tracking-widest">Patient Identity</h2>
              </div>
              <div className="p-6 flex flex-col items-center text-center">
                 <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-black text-2xl mb-3">L</div>
                 <h3 className="font-black text-lg">Liam Anderson</h3>
                 <p className="text-sm font-bold text-slate-500">Record #{id}</p>
                 <div className="flex gap-2 mt-3 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                   <span>Male, 41</span> | <span className="text-rose-500">Blood: O+</span>
                 </div>
              </div>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm shrink-0">
              <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-2">
                <Activity size={18} className="text-rose-600" />
                <h2 className="font-black text-slate-800 uppercase text-[11px] tracking-widest">Vitals Profiling</h2>
              </div>
              <div className="p-6"><VitalSignsForm /></div>
            </div>
          </div>

          {/* RIGHT: CLINICAL INPUTS */}
          <div className="lg:col-span-8 flex flex-col bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
            <div className="flex border-b border-slate-100 px-6 pt-2 bg-slate-50/50 shrink-0">
              <button onClick={() => setActiveTab('notes')} className={`flex items-center gap-2 px-6 py-4 font-black text-sm transition-all border-b-2 ${activeTab === 'notes' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                <ClipboardList size={16} /> Clinical Notes
              </button>
              <button onClick={() => setActiveTab('prescriptions')} className={`flex items-center gap-2 px-6 py-4 font-black text-sm transition-all border-b-2 ${activeTab === 'prescriptions' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                <Pill size={16} /> E-Prescription
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-slate-50/30">
              {activeTab === 'notes' && <ConsultationForm />}
              {activeTab === 'prescriptions' && <PrescriptionBuilder />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}