import React, { useState } from 'react';
import { History, Pill, ChevronLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import PatientHistoryTimeline from '@/features/patients/components/PatientHistoryTimeline';

export default function MedicalRecordDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'timeline' | 'medications'>('timeline');

  // Chữ "Acute Bronchitis" được bọc span với text-sm
  const recordHistory = [{ 
    recordId: Number(id), 
    date: '2026-04-20', 
    doctor: 'Dr. Sarah Smith', 
    diagnosis: <span className="text-sm font-medium text-slate-600">Acute Bronchitis</span>, 
    treatment: 'Prescribed inhaler.' 
  }];

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto w-full flex flex-col h-full space-y-6">
        <div className="flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <ChevronLeft size={24} className="cursor-pointer text-slate-400 hover:text-slate-600 transition-colors" onClick={() => navigate(-1)} />
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">Chi tiết hồ sơ bệnh án</h1>
              <p className="text-sm text-slate-500 mt-0.5">Xem thông tin chi tiết của <span className="font-medium text-slate-700">#REC-{id}</span></p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-100 px-5 pt-1 bg-slate-50 shrink-0">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`cursor-pointer flex items-center gap-2 px-5 py-3 font-semibold text-sm transition-all border-b-2 ${
                activeTab === 'timeline'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <History size={16} /> Ghi chú
            </button>
            <button
              onClick={() => setActiveTab('medications')}
              className={`cursor-pointer flex items-center gap-2 px-5 py-3 font-semibold text-sm transition-all border-b-2 ${
                activeTab === 'medications'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Pill size={16} /> Đơn thuốc
            </button>
          </div>

          <div className="p-5 flex-1 overflow-y-auto bg-slate-50/30">
            {activeTab === 'timeline' && <PatientHistoryTimeline visits={recordHistory} />}
            {activeTab === 'medications' && (
              <div className="text-center text-slate-500 py-10 font-medium">Danh sách đơn thuốc sẽ hiển thị tại đây.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}