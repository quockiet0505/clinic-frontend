import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ChevronLeft, UserCircle, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { medicalApi } from '../api/medicalApi';
import { MedicalRecordDetail, VitalSigns } from '../types/medical';
import VitalSignsForm from '../components/VitalSignsForm';
import { patientApi } from '@/features/patients/api/patientApi';

export default function TriageWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState<MedicalRecordDetail | null>(null);
  const [patientVitals, setPatientVitals] = useState<VitalSigns | null>(null);
  
  // Create a ref to hold the current vitals from the child form
  const vitalsRef = useRef<Partial<VitalSigns>>({});

  React.useEffect(() => {
    if (id) {
      medicalApi.getRecordDetail(Number(id)).then(res => {
        if (res) {
          setRecord(res);
          // Fetch existing patient profile for vitals
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
              vitalsRef.current = {
                height: p.height,
                weight: p.weight ? Number(p.weight) : undefined,
                bloodPressure: p.bloodPressure,
                pulse: p.pulse,
                bloodType: p.bloodType,
                allergies: p.allergies,
                chronicDiseases: p.medicalHistory,
              };
            }
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

  const handleSaveTriage = async () => {
    if (!id) return;
    try {
      const data = vitalsRef.current;
      const res = await medicalApi.updateTriage(Number(id), data);
      if (res) {
        toast.success('Đã lưu sinh hiệu thành công!');
        navigate(-1);
      } else {
        toast.error('Có lỗi xảy ra khi lưu sinh hiệu.');
      }
    } catch (e) {
      toast.error('Không thể kết nối đến máy chủ.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="max-w-[800px] mx-auto w-full flex flex-col h-full space-y-6">
        <div className="flex justify-between items-center shrink-0">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 font-medium text-slate-500 hover:text-slate-800 transition-colors px-2 py-2 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <ChevronLeft size={20} /> Quay lại
          </button>

          <div className="flex gap-3">
            <Button onClick={handleSaveTriage} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 rounded-xl h-10 shadow-sm cursor-pointer">
              <Save size={16} className="mr-2" /> Lưu & Hoàn tất
            </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pb-4">
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
              <Activity size={18} className="text-indigo-600" />
              <h2 className="font-semibold text-slate-600 text-sm uppercase tracking-wider">Đo Sinh hiệu & Thông tin bệnh lý</h2>
            </div>
            <div className="p-5">
              {patientVitals !== null && (
                <VitalSignsForm 
                  initialData={patientVitals} 
                  onChange={(vitals) => {
                    vitalsRef.current = vitals;
                  }} 
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
