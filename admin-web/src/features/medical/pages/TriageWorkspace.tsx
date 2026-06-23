import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Activity, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

import { medicalApi } from '../api/medicalApi';
import type { MedicalRecordDetail, VitalSigns } from '../types/medical';
import VitalSignsForm from '../components/VitalSignsForm';
import PatientSummaryBanner from '../components/PatientSummaryBanner';
import DetailPageHeader, { ActionButton } from '@/components/common/DetailPageHeader';
import { patientApi } from '@/features/patients/api/patientApi';

export default function TriageWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState<MedicalRecordDetail | null>(null);
  const [patientVitals, setPatientVitals] = useState<VitalSigns | null>(null);
  const [saving, setSaving] = useState(false);

  const vitalsRef = useRef<Partial<VitalSigns>>({});

  React.useEffect(() => {
    if (!id) return;
    medicalApi.getRecordDetail(Number(id)).then((res) => {
      if (!res) return;
      setRecord(res);
      patientApi.getById(res.patientId).then((p) => {
        if (!p) return;
        const initial: VitalSigns = {
          height: p.height,
          weight: p.weight ? Number(p.weight) : undefined,
          bloodPressure: p.bloodPressure,
          pulse: p.pulse,
          bloodType: p.bloodType,
          allergies: p.allergies,
          chronicDiseases: p.medicalHistory,
        };
        setPatientVitals(initial);
        vitalsRef.current = initial;
      });
    });
  }, [id]);

  const handleSaveTriage = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const res = await medicalApi.updateTriage(Number(id), vitalsRef.current);
      if (res) {
        toast.success('Đã lưu sinh hiệu thành công!');
        navigate(-1);
      } else {
        toast.error('Có lỗi xảy ra khi lưu sinh hiệu.');
      }
    } catch (e) {
      toast.error('Không thể kết nối đến máy chủ.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] animate-in fade-in duration-300 pb-6">
      <div className="max-w-[920px] mx-auto w-full space-y-5">
        <DetailPageHeader
          title="Chuẩn bị khám"
          subtitle="Đo sinh hiệu và ghi nhận thông tin bệnh lý trước khi bác sĩ khám"
          code={record ? `HS-${String(record.recordId).padStart(6, '0')}` : undefined}
          onBack={() => navigate(-1)}
          backLabel="Về danh sách"
          actions={
            <>
              <ActionButton
                icon={<X size={14} />}
                label="Hủy"
                onClick={() => navigate(-1)}
                tone="rose"
              />
              <ActionButton
                icon={saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                label={saving ? 'Đang lưu...' : 'Lưu & Hoàn tất'}
                onClick={handleSaveTriage}
                tone="primary"
                disabled={saving}
              />
            </>
          }
        />

        <PatientSummaryBanner record={record} recordId={id} />

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2 bg-gradient-to-r from-indigo-50/60 to-blue-50/40 rounded-t-2xl">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600">
              <Activity size={14} />
            </span>
            <h2 className="font-bold text-slate-800 text-[14px]">
              Đo sinh hiệu &amp; Thông tin bệnh lý
            </h2>
          </div>
          <div className="p-5">
            {patientVitals !== null ? (
              <VitalSignsForm
                initialData={patientVitals}
                onChange={(vitals) => {
                  vitalsRef.current = vitals;
                }}
              />
            ) : (
              <div className="text-center py-8 text-[13px] text-slate-500 font-medium">
                Đang tải thông tin bệnh nhân...
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
