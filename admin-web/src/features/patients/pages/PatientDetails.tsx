import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, UserCircle2, Phone, MapPin, Activity, BriefcaseMedical } from 'lucide-react';
import { Button } from '@/components/ui/button';

import PatientHistoryTimeline from '../components/PatientHistoryTimeline';

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const patient = {
    patientId: id, 
    fullName: 'Liam Anderson', 
    gender: 'Male', 
    date_of_birth: '1985-06-15', 
    age: 41, 
    bloodType: 'O+',
    phone: '+1 (555) 123-4567', 
    email: 'liam.anderson@email.com', 
    address: '123 Main St, New York, NY 10001', 
    allergies: 'Penicillin, Peanuts', 
    chronicDiseases: 'None',
    recentVisits: [
      { 
        recordId: 902, 
        date: '2026-04-01', 
        doctor: 'Dr. Robert Davis', 
        diagnosis: 'Essential Hypertension',
        treatment: 'Prescribed Amlodipine 5mg daily. Advised low-sodium diet and regular exercise.'
      },
      { 
        recordId: 885, 
        date: '2025-11-12', 
        doctor: 'Dr. Sarah Smith', 
        diagnosis: 'Annual Checkup',
        treatment: 'All vitals normal. Recommended standard flu vaccination.'
      }
    ]
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="max-w-[1000px] mx-auto w-full flex flex-col h-full space-y-6">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 shrink-0">
          <Button variant="ghost" onClick={() => navigate('/patients')} className="rounded-2xl h-11 w-11 p-0 text-slate-500 bg-white shadow-sm border border-slate-200 hover:bg-slate-50">
            <ChevronLeft size={22}/>
          </Button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tổng quan Hồ sơ Bệnh nhân</h1>
            <p className="text-sm text-slate-500 mt-1">Đang xem thông tin chi tiết của <span className="font-bold text-blue-600">PAT-{id}</span></p>
          </div>
        </div>

        {/* DEMOGRAPHICS CARD */}
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden shrink-0">
          <div className="bg-blue-600 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center font-black text-4xl text-white shadow-lg border-2 border-white/10 shrink-0">
              {patient.fullName.charAt(0)}
            </div>
            <div className="flex-1 w-full text-center sm:text-left text-white">
              <h2 className="text-3xl font-black">{patient.fullName}</h2>
              <div className="mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="bg-white/20 text-white px-3 py-1 rounded-lg font-bold text-sm">PAT-{patient.patientId}</span>
                <span className="border border-white/30 px-3 py-1 rounded-lg text-white font-medium text-sm">Hoạt động</span>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/50">
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                <UserCircle2 size={16} /> Thông tin Cá nhân
              </h3>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="font-bold text-slate-500">Gender/Age:</span>
                <span className="col-span-2 font-bold text-slate-900">{patient.gender}, {patient.age} tuổi ({patient.date_of_birth})</span>
                
                <span className="font-bold text-slate-500">Phone:</span>
                <span className="col-span-2 font-bold text-slate-900 flex items-center gap-2"><Phone size={14} className="text-blue-500"/> {patient.phone}</span>
                
                <span className="font-bold text-slate-500">Email:</span>
                <span className="col-span-2 font-bold text-slate-900">{patient.email}</span>
                
                <span className="font-bold text-slate-500">Address:</span>
                <span className="col-span-2 font-bold text-slate-900 flex items-start gap-2"><MapPin size={14} className="text-rose-500 shrink-0 mt-0.5"/> {patient.address}</span>
              </div>
            </div>

            {/* Medical Context */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                <Activity size={16} /> Thông tin Khẩn cấp & Sinh hiệu
              </h3>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="font-bold text-slate-500">Nhóm máu:</span>
                <span className="col-span-2 font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md w-max">{patient.bloodType}</span>
                
                <span className="font-bold text-slate-500">Dị ứng:</span>
                <span className="col-span-2 font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md w-max">{patient.allergies}</span>
                
                <span className="font-bold text-slate-500 mt-2">Bệnh lý mãn tính:</span>
                <span className="col-span-2 font-bold text-slate-900 mt-2 leading-relaxed">{patient.chronicDiseases}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CLINICAL HISTORY TIMELINE */}
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
          <div className="p-5 bg-slate-50/50 border-b border-slate-100 flex items-center gap-2 shrink-0">
            <BriefcaseMedical size={18} className="text-indigo-600" />
            <h2 className="font-black text-slate-800 uppercase text-[11px] tracking-widest">Các Lần Khám Gần Đây</h2>
          </div>
          
          <div className="p-0 overflow-y-auto custom-scrollbar flex-1 bg-white">
            <PatientHistoryTimeline visits={patient.recentVisits} />
          </div>
          
        </div>

      </div>
    </div>
  );
}