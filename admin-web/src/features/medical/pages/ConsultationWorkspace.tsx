import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ClipboardList, Pill, Loader2 } from 'lucide-react';
import ConsultationForm from '../components/ConsultationForm';
import PrescriptionBuilder from '../components/PrescriptionBuilder';
import PatientSummaryBanner from '../components/PatientSummaryBanner';
import DetailPageHeader, { ActionButton } from '@/components/common/DetailPageHeader';

import { medicalApi } from '../api/medicalApi';
import type { MedicalRecordDetail, VitalSigns } from '../types/medical';

export default function ConsultationWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'notes' | 'prescriptions'>('notes');
  const [record, setRecord] = useState<MedicalRecordDetail | null>(null);
  const [patientVitals, setPatientVitals] = useState<VitalSigns | null>(null);
  const [savingDraft] = useState(false);
  const [completing] = useState(false);

  React.useEffect(() => {
    if (!id) return;
    medicalApi.getRecordDetail(Number(id)).then((res) => {
      if (!res) return;
      setRecord(res);
      import('@/features/patients/api/patientApi').then(({ patientApi }) => {
        patientApi.getById(res.patientId).then((p) => {
          if (!p) return;
          setPatientVitals({
            height: p.height,
            weight: p.weight ? Number(p.weight) : undefined,
            bloodPressure: p.bloodPressure,
            pulse: p.pulse,
            bloodType: p.bloodType,
            allergies: p.allergies,
            chronicDiseases: p.medicalHistory,
          });
        });
      });
    });
  }, [id]);

  return (
    <div className="space-y-5 animate-in fade-in duration-300 h-[calc(100vh-6rem)] flex flex-col">
      <div className="max-w-[1200px] mx-auto w-full flex flex-col h-full space-y-5">
        <DetailPageHeader
          title="Đang khám bệnh"
          subtitle="Ghi nhận chẩn đoán, phác đồ điều trị và kê đơn thuốc"
          code={record ? `HS-${String(record.recordId).padStart(6, '0')}` : undefined}
          onBack={() => navigate(-1)}
          backLabel="Thoát phiên khám"
          actions={
            <>
              <ActionButton
                icon={savingDraft ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                label="Lưu nháp"
                tone="sky"
                disabled={savingDraft}
              />
              <ActionButton
                icon={completing ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                label="Hoàn tất khám"
                tone="primary"
                disabled={completing}
              />
            </>
          }
        />

        <PatientSummaryBanner
          record={record}
          recordId={id}
          vitals={patientVitals}
          showVitals
        />

        <section className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-0">
          <div className="flex border-b border-slate-200 px-2 pt-2 bg-slate-50/60 shrink-0">
            <TabButton
              active={activeTab === 'notes'}
              onClick={() => setActiveTab('notes')}
              icon={<ClipboardList size={15} />}
              label="Phiếu khám bệnh"
            />
            <TabButton
              active={activeTab === 'prescriptions'}
              onClick={() => setActiveTab('prescriptions')}
              icon={<Pill size={15} />}
              label="Kê đơn thuốc"
            />
          </div>
          <div className="flex-1 p-5 md:p-6 overflow-y-auto bg-white custom-scrollbar">
            {activeTab === 'notes' && <ConsultationForm />}
            {activeTab === 'prescriptions' && <PrescriptionBuilder />}
          </div>
        </section>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 font-semibold text-[13px] rounded-t-lg transition-all border-b-2 -mb-px ${
        active
          ? 'border-blue-600 text-blue-700 bg-white'
          : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-white/50'
      }`}
    >
      {icon} {label}
    </button>
  );
}
