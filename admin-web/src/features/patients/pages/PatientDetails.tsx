import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, UserCircle2, Phone, MapPin, Activity, BriefcaseMedical } from 'lucide-react';
import { Button } from '@/components/ui/button';

import PatientHistoryTimeline from '../components/PatientHistoryTimeline';
import { patientApi } from '../api/patientApi';

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [patient, setPatient] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        try {
          const data = await patientApi.getById(Number(id));
          if (data) {
            setPatient({
              ...data,
              bloodType: data.bloodType || 'Chưa cập nhật',
              allergies: data.allergies || 'Chưa cập nhật',
              chronicDiseases: data.chronicDiseases || 'Chưa cập nhật',
              recentVisits: data.recentVisits || []
            });
          }
        } catch (error) {
          console.error("Failed to fetch patient", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPatient();
  }, [id]);

  if (loading) return <div className="p-8 text-slate-500 font-medium">Đang tải...</div>;
  if (!patient) return <div className="p-8 text-rose-500">Không tìm thấy bệnh nhân</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="max-w-[1000px] mx-auto w-full flex flex-col h-full space-y-6">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 shrink-0">
          <Button variant="ghost" onClick={() => navigate('/patients')} className="cursor-pointer rounded-2xl h-11 w-11 p-0 text-primary-500 bg-white shadow-sm border border-primary-200 hover:bg-primary-50 hover:text-primary-600 transition-colors">
            <ChevronLeft size={22}/>
          </Button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tổng quan Hồ sơ Bệnh nhân</h1>
            <p className="text-xs text-primary-500 font-medium mt-1">Đang xem thông tin chi tiết của <span className="font-bold text-primary-700">PAT-{id}</span></p>
          </div>
        </div>

        {/* DEMOGRAPHICS CARD */}
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden shrink-0">
          <div className="bg-primary-50 border-b border-primary-100 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-16 h-16 bg-white rounded-[20px] flex items-center justify-center font-bold text-2xl text-primary-600 shadow-sm border border-primary-100 shrink-0 uppercase">
              {patient.fullName.charAt(0)}
            </div>
            <div className="flex-1 w-full text-center sm:text-left text-slate-800">
              <h2 className="text-xl font-bold">{patient.fullName}</h2>
              <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="bg-white text-primary-600 px-3 py-1 rounded-[10px] font-semibold text-[11px] shadow-sm border border-primary-100 uppercase tracking-widest">PAT-{patient.patientId}</span>
                <span className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-3 py-1 rounded-[10px] font-semibold text-[11px] shadow-sm uppercase tracking-widest">Hoạt động</span>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/50">
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                <UserCircle2 size={16} /> Thông tin Cá nhân
              </h3>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <span className="font-medium text-slate-500">Giới tính/Tuổi:</span>
                <span className="col-span-2 font-semibold text-slate-800">{patient.gender === 'MALE' || patient.gender === 'Male' ? 'Nam' : patient.gender === 'FEMALE' || patient.gender === 'Female' ? 'Nữ' : 'Khác'}, {patient.age || 'Chưa có'} tuổi ({patient.dateOfBirth})</span>
                
                <span className="font-medium text-slate-500">SĐT:</span>
                <span className="col-span-2 font-semibold text-slate-800 flex items-center gap-2"><Phone size={14} className="text-blue-500"/> {patient.phone}</span>
                
                <span className="font-medium text-slate-500">Email:</span>
                <span className="col-span-2 font-semibold text-slate-800">{patient.email || 'Chưa cập nhật'}</span>
                
                <span className="font-medium text-slate-500">Địa chỉ:</span>
                <span className="col-span-2 font-semibold text-slate-800 flex items-start gap-2"><MapPin size={14} className="text-rose-500 shrink-0 mt-0.5"/> {patient.address}</span>
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