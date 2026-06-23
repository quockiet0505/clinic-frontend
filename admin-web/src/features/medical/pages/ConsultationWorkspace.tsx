import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ChevronLeft, UserCircle, Activity, ClipboardList, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VitalSignsForm from '../components/VitalSignsForm';
import ConsultationForm from '../components/ConsultationForm';
import PrescriptionBuilder from '../components/PrescriptionBuilder';

import { medicalApi } from '../api/medicalApi';
import { MedicalRecordDetail } from '../types/medical';

export default function ConsultationWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'notes' | 'prescriptions'>('notes');
  const [record, setRecord] = useState<MedicalRecordDetail | null>(null);
  const [patientVitals, setPatientVitals] = useState<VitalSigns | null>(null);

  React.useEffect(() => {
    if (id) {
      medicalApi.getRecordDetail(Number(id)).then(res => {
        if (res) {
          setRecord(res);
          // Fetch vitals
          import('@/features/patients/api/patientApi').then(({ patientApi }) => {
            patientApi.getById(res.patientId).then(p => {
              if (p) {
                setPatientVitals({
                  height: p.height,
                  weight: p.weight ? Number(p.weight) : undefined,
                  bloodPressure: p.bloodPressure,
                  pulse: p.pulse,
                  bloodType: p.bloodType,
                  allergies: p.allergies,
                  chronicDiseases: p.medicalHistory,
                });
              }
            });
          });
        }
      });
    }
  }, [id]);

  const patientInitials = record?.patientFullName ? record.patientFullName.charAt(0).toUpperCase() : 'U';
  
  const calculateAge = (dob?: string) => {
    if (!dob) return '?';
    const birthYear = new Date(dob).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col h-full space-y-6">
        {/* Header - không có thanh bao quanh, nút Thoát riêng bên trái */}
        <div className="flex justify-between items-center shrink-0">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 font-medium text-slate-500 hover:text-slate-800 transition-colors px-2 py-2 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <ChevronLeft size={20} /> Thoát phiên làm việc
          </button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="font-medium border-blue-200 text-blue-600 bg-white hover:bg-blue-50 hover:border-blue-300 rounded-xl h-10 px-5 cursor-pointer"
            >
              <Save size={16} className="mr-2" /> Lưu nháp
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 rounded-xl h-10 shadow-sm cursor-pointer">
              <Save size={16} className="mr-2" /> Hoàn tất khám
            </Button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden pb-4">
          {/* Left panel */}
          <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm shrink-0">
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                <UserCircle size={18} className="text-blue-600" />
                <h2 className="font-semibold text-slate-600 text-sm uppercase tracking-wider">Thông tin bệnh nhân</h2>
              </div>
              <div className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-2xl mb-3">{patientInitials}</div>
                <h3 className="font-bold text-lg text-slate-800">{record?.patientFullName || 'Đang tải...'}</h3>
                <p className="text-sm text-slate-500">Hồ sơ #{id}</p>
                <div className="flex gap-2 mt-3 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <span>{record?.patientGender === 'MALE' ? 'Nam' : record?.patientGender === 'FEMALE' ? 'Nữ' : 'Khác'}, {calculateAge(record?.patientDob)} tuổi</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm shrink-0">
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                <Activity size={18} className="text-rose-600" />
                <h2 className="font-semibold text-slate-600 text-sm uppercase tracking-wider">Sức khoẻ & Sinh tồn</h2>
              </div>
              <div className="p-5">
                {patientVitals ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm">
                        <span className="text-sm font-medium text-slate-500">Huyết áp</span>
                        <span className="font-bold text-slate-700">{patientVitals.bloodPressure || '--'}</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm">
                        <span className="text-sm font-medium text-slate-500">Nhịp tim</span>
                        <span className="font-bold text-slate-700">{patientVitals.pulse ? `${patientVitals.pulse} bpm` : '--'}</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm">
                        <span className="text-sm font-medium text-slate-500">Cân nặng</span>
                        <span className="font-bold text-slate-700">{patientVitals.weight ? `${patientVitals.weight} kg` : '--'}</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm">
                        <span className="text-sm font-medium text-slate-500">Chiều cao</span>
                        <span className="font-bold text-slate-700">{patientVitals.height ? `${patientVitals.height} cm` : '--'}</span>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-slate-100 space-y-3 mt-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold uppercase text-slate-400">Nhóm máu</span>
                        <span className="text-sm font-medium text-rose-600 bg-rose-50 w-fit px-2 py-0.5 rounded-md">{patientVitals.bloodType || 'Chưa có'}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold uppercase text-slate-400">Dị ứng</span>
                        <span className="text-sm font-medium text-amber-700">{patientVitals.allergies || 'Không'}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold uppercase text-slate-400">Bệnh mãn tính</span>
                        <span className="text-sm font-medium text-slate-700">{patientVitals.chronicDiseases || 'Không'}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 text-center py-4">Đang tải thông tin...</p>
                )}
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="lg:col-span-8 flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="flex border-b border-slate-100 px-5 pt-1 bg-slate-50 shrink-0">
              <button
                onClick={() => setActiveTab('notes')}
                className={`cursor-pointer flex items-center gap-2 px-5 py-3 font-semibold text-sm transition-all border-b-2 ${
                  activeTab === 'notes'
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <ClipboardList size={16} /> Phiếu Khám Bệnh
              </button>
              <button
                onClick={() => setActiveTab('prescriptions')}
                className={`cursor-pointer flex items-center gap-2 px-5 py-3 font-semibold text-sm transition-all border-b-2 ${
                  activeTab === 'prescriptions'
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Pill size={16} /> Kê Đơn Thuốc
              </button>
            </div>
            <div className="flex-1 p-5 overflow-y-auto bg-slate-50/30">
              {activeTab === 'notes' && <ConsultationForm />}
              {activeTab === 'prescriptions' && <PrescriptionBuilder />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}