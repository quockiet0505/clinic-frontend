import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, UserCircle2, Phone, MapPin, Activity, BriefcaseMedical, Droplet, AlertCircle, Heart, Calendar, Cake } from 'lucide-react';
import { Button } from '@/components/ui/button';

import PatientHistoryTimeline from '../components/PatientHistoryTimeline';
import { patientApi } from '../api/patientApi';

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [patient, setPatient] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  const calculateAge = (dob: string) => {
    if (!dob) return null;
    const birth = new Date(dob);
    const diff = Date.now() - birth.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

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

  const age = calculateAge(patient.dateOfBirth);
  const genderText = patient.gender === 'MALE' || patient.gender === 'Male' ? 'Nam' : patient.gender === 'FEMALE' || patient.gender === 'Female' ? 'Nữ' : 'Khác';

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="max-w-[1000px] mx-auto w-full flex flex-col h-full space-y-6">
        
        {/* HEADER */}
        <div className="flex items-center gap-3 shrink-0">
          <ChevronLeft 
            size={28} 
            className="cursor-pointer text-slate-400 hover:text-slate-600 transition-colors" 
            onClick={() => navigate('/patients')} 
          />
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Tổng quan Hồ sơ Bệnh nhân</h1>
            <p className="text-sm text-slate-500 mt-0.5">Đang xem thông tin chi tiết của <span className="font-semibold text-slate-700">#PAT-{id}</span></p>
          </div>
        </div>

        {/* DEMOGRAPHICS CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden shrink-0">
          {/* Header gradient + avatar */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b border-blue-100">
            <div className="w-20 h-20 rounded-2xl bg-white text-blue-700 flex items-center justify-center font-bold text-3xl shadow-md border border-blue-100 shrink-0 uppercase">
              {patient.fullName.charAt(0)}
            </div>
            <div className="flex-1 w-full text-center sm:text-left">
              <h2 className="text-2xl font-bold text-slate-800">{patient.fullName}</h2>
              <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="bg-white/80 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold shadow-sm border border-blue-200">
                  PAT-{patient.patientId}
                </span>
                <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200">
                  Hoạt động
                </span>
              </div>
            </div>
          </div>

          {/* Body - 2 cột dọc, mỗi cột là một list */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/50">
            {/* Cột trái: Thông tin cá nhân */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                <UserCircle2 size={16} /> Thông tin Cá nhân
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-slate-500 w-28 shrink-0">Giới tính:</span>
                  <span className="font-semibold text-slate-800">{genderText}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-slate-500 w-28 shrink-0">Tuổi:</span>
                  <span className="font-semibold text-slate-800">{age ? `${age} tuổi` : 'Chưa có'}</span>
                </div>
                <div className="flex items-center gap-3">
                  {/* <Calendar size={14} className="text-slate-400 shrink-0" /> */}
                  <span className="font-medium text-slate-500 w-28 shrink-0">Ngày sinh:</span>
                  <span className="font-semibold text-slate-800">{patient.dateOfBirth || 'Chưa cập nhật'}</span>
                </div>
                {patient.email && (
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-500 w-28 shrink-0">Email:</span>
                    <span className="font-semibold text-slate-800 break-all">{patient.email}</span>
                  </div>
                )}
                {/* SĐT và Địa chỉ đưa xuống cuối */}
                <div className="pt-2 mt-2 border-t border-slate-200"></div>
                <div className="flex items-center gap-3">
                  <Phone size={14} className="text-blue-500 shrink-0" />
                  <span className="font-medium text-slate-500 w-28 shrink-0">Số điện thoại:</span>
                  <span className="font-semibold text-slate-800">{patient.phone}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={14} className="text-rose-500 shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-500 w-28 shrink-0">Địa chỉ:</span>
                  <span className="font-semibold text-slate-800">{patient.address}</span>
                </div>
              </div>
            </div>

            {/* Cột phải: Thông tin sức khỏe */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-4">
                <Activity size={16} /> Thông tin Sức khỏe
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Droplet size={14} className="text-rose-500 shrink-0" />
                  <span className="font-medium text-slate-500 w-28 shrink-0">Nhóm máu:</span>
                  <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">{patient.bloodType}</span>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-500 w-28 shrink-0">Dị ứng:</span>
                  <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">{patient.allergies}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Heart size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-500 w-28 shrink-0">Bệnh mãn tính:</span>
                  <span className="font-semibold text-slate-800 leading-relaxed">{patient.chronicDiseases}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CLINICAL HISTORY TIMELINE */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
          <div className="p-5 bg-slate-50/50 border-b border-slate-100 flex items-center gap-2 shrink-0">
            <BriefcaseMedical size={18} className="text-indigo-600" />
            <h2 className="font-bold text-slate-600 uppercase text-xs tracking-wider">Các Lần Khám Gần Đây</h2>
          </div>
          <div className="p-0 overflow-y-auto custom-scrollbar flex-1 bg-white">
            <PatientHistoryTimeline visits={patient.recentVisits} />
          </div>
        </div>

      </div>
    </div>
  );
}