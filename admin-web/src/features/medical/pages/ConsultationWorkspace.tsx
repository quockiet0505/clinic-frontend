import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ClipboardList, Pill, Loader2, FlaskConical, Hourglass, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import ConsultationForm, { ConsultationFormData } from '../components/ConsultationForm';
import ConsultationOrdersPanel from '../components/ConsultationOrdersPanel';
import PrescriptionBuilder from '../components/PrescriptionBuilder';
import PatientSummaryBanner from '../components/PatientSummaryBanner';
import DetailPageHeader, { ActionButton } from '@/components/common/DetailPageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import ServiceOrderFormDialog from '@/features/laboratory/components/ServiceOrderFormDialog';
import FollowUpFormDialog, { FollowUpFormData } from '../components/FollowUpFormDialog';
import { medicalApi } from '../api/medicalApi';
import { laboratoryApi } from '@/features/laboratory/api/laboratoryApi';
import { appointmentApi } from '@/features/appointments/api/appointmentApi';
import { followUpApi } from '@/features/appointments/api/followUpApi';
import { useAuth } from '@/context/AuthContext';
import type { MedicalRecordDetail, ServiceOrder } from '../types/medical';

type TabKey = 'notes' | 'orders' | 'prescriptions';

export default function ConsultationWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const recordId = Number(id);

  const [activeTab, setActiveTab] = useState<TabKey>('notes');
  const [record, setRecord] = useState<MedicalRecordDetail | null>(null);
  const [patientVitals, setPatientVitals] = useState<import('../types/medical').VitalSigns | null>(null);
  const [form, setForm] = useState<ConsultationFormData>({ diagnosis: '', treatment: '', note: '' });
  const [savingDraft, setSavingDraft] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [sendingToLab, setSendingToLab] = useState(false);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [followUpDialogOpen, setFollowUpDialogOpen] = useState(false);
  const [followUpSaving, setFollowUpSaving] = useState(false);

  const loadRecord = useCallback(async () => {
    if (!recordId) return;
    const res = await medicalApi.getRecordDetail(recordId);
    if (!res) return;
    setRecord(res);
    setForm({
      diagnosis: res.diagnosis || '',
      treatment: res.treatment || '',
      note: res.note || '',
    });

    const { patientApi } = await import('@/features/patients/api/patientApi');
    const p = await patientApi.getById(res.patientId);
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
  }, [recordId]);

  useEffect(() => {
    loadRecord();
  }, [loadRecord]);

  const orders: ServiceOrder[] = (record?.serviceOrders as ServiceOrder[]) || [];
  const hasPendingOrders = orders.some((o) => o.status === 'ORDERED');
  const canPrescribe = !hasPendingOrders;
  const isInProgress = record?.appointmentStatus === 'IN_PROGRESS' || record?.status === 'IN_PROGRESS';
  const isWaitingResult = record?.status === 'WAITING_RESULT' || record?.appointmentStatus === 'WAITING_RESULT';
  const canSendToLab = Boolean(record?.appointmentId) && isInProgress && hasPendingOrders;
  const isReadOnly = isWaitingResult || record?.status === 'DONE';

  const patientLabel = record?.patientFullName || record?.patientName || 'bệnh nhân';

  const handleSaveDraft = async () => {
    if (!record) return;
    setSavingDraft(true);
    try {
      await medicalApi.updateRecord(record.recordId, {
        patientId: record.patientId,
        mainDoctorId: record.mainDoctorId,
        appointmentId: record.appointmentId,
        diagnosis: form.diagnosis,
        treatment: form.treatment,
        note: form.note,
        status: record.status,
      });
      await loadRecord();
    } catch {
      /* toast: axios interceptor */
    }
    setSavingDraft(false);
  };

  const defaultFollowUpDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  }, []);

  const finishAndExit = () => {
    setFollowUpDialogOpen(false);
    navigate('/medical/active-visits');
  };

  const handleComplete = async () => {
    if (!record) return;
    if (hasPendingOrders) {
      toast.error('Còn chỉ định chưa có kết quả — hãy chuyển chờ kết quả hoặc đợi Lab xong');
      return;
    }
    setCompleting(true);
    try {
      await medicalApi.updateRecord(record.recordId, {
        patientId: record.patientId,
        mainDoctorId: record.mainDoctorId,
        appointmentId: record.appointmentId,
        diagnosis: form.diagnosis,
        treatment: form.treatment,
        note: form.note,
        status: 'DONE',
      });
      setFollowUpDialogOpen(true);
    } catch {
      /* toast: axios interceptor */
    }
    setCompleting(false);
  };

  const handleFollowUpSubmit = async (data: FollowUpFormData) => {
    if (!record?.mainDoctorId) return;
    setFollowUpSaving(true);
    try {
      const time = (data.scheduledTime || '09:00').slice(0, 5);
      await followUpApi.create({
        recordId: record.recordId,
        patientId: record.patientId,
        doctorId: record.mainDoctorId,
        scheduledDatetime: `${data.scheduledDate}T${time}:00`,
        note: data.note,
      });
      finishAndExit();
    } catch {
      /* toast: axios interceptor */
    }
    setFollowUpSaving(false);
  };

  const handleCreateOrder = async (data: { recordId: number; serviceId: number; orderedById: number }) => {
    try {
      await laboratoryApi.createServiceOrder(data);
      setOrderDialogOpen(false);
      await loadRecord();
      setActiveTab('orders');
    } catch {
      /* toast: axios interceptor */
    }
  };

  const handleSendToLab = async () => {
    if (!record?.appointmentId) return;
    setSendingToLab(true);
    try {
      await appointmentApi.sendToLab(record.appointmentId);
      navigate('/appointments');
    } catch {
      /* toast: axios interceptor */
    }
    setSendingToLab(false);
  };

  const tabPrescriptionClass = useMemo(() => {
    if (!canPrescribe) return 'opacity-50 cursor-not-allowed';
    return '';
  }, [canPrescribe]);

  return (
    <div className="space-y-5 animate-in fade-in duration-300 h-[calc(100vh-6rem)] flex flex-col">
      <div className="max-w-[1200px] mx-auto w-full flex flex-col h-full space-y-5">
        <DetailPageHeader
          title="Đang khám bệnh"
          subtitle="Ghi nhận chẩn đoán, chỉ định CLS, đọc kết quả và kê đơn"
          code={record ? `HS-${String(record.recordId).padStart(6, '0')}` : undefined}
          statusBadge={record?.status ? <StatusBadge status={record.status} /> : undefined}
          onBack={() => navigate(-1)}
          backLabel="Thoát phiên khám"
          actions={
            !isReadOnly ? (
              <>
                <ActionButton
                  icon={<FlaskConical size={14} />}
                  label="Tạo chỉ định"
                  tone="violet"
                  onClick={() => setOrderDialogOpen(true)}
                  disabled={!isInProgress}
                />
                {canSendToLab && (
                  <ActionButton
                    icon={sendingToLab ? <Loader2 size={14} className="animate-spin" /> : <Hourglass size={14} />}
                    label="Chuyển chờ kết quả"
                    tone="amber"
                    onClick={handleSendToLab}
                    disabled={sendingToLab}
                  />
                )}
                <ActionButton
                  icon={savingDraft ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  label="Lưu nháp"
                  tone="sky"
                  disabled={savingDraft}
                  onClick={handleSaveDraft}
                />
                <ActionButton
                  icon={completing ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  label="Hoàn tất khám"
                  tone="primary"
                  disabled={completing || hasPendingOrders}
                  onClick={handleComplete}
                />
              </>
            ) : undefined
          }
        />

        {isWaitingResult && (
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <AlertCircle size={16} />
            Bệnh nhân đang chờ kết quả cận lâm sàng. Phiên khám ở chế độ chỉ xem.
          </div>
        )}

        {hasPendingOrders && isInProgress && (
          <div className="flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-800">
            <FlaskConical size={16} />
            Còn {orders.filter((o) => o.status === 'ORDERED').length} chỉ định chưa có KQ — kê đơn bị khóa cho đến khi có kết quả.
          </div>
        )}

        <PatientSummaryBanner record={record} recordId={id} vitals={patientVitals} showVitals />

        <section className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-0">
          <div className="flex border-b border-slate-200 px-2 pt-2 bg-slate-50/60 shrink-0">
            <TabButton active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} icon={<ClipboardList size={15} />} label="Phiếu khám" />
            <TabButton
              active={activeTab === 'orders'}
              onClick={() => setActiveTab('orders')}
              icon={<FlaskConical size={15} />}
              label={`Chỉ định & KQ${orders.length ? ` (${orders.length})` : ''}`}
            />
            <TabButton
              active={activeTab === 'prescriptions'}
              onClick={() => canPrescribe && setActiveTab('prescriptions')}
              icon={<Pill size={15} />}
              label="Kê đơn thuốc"
              className={tabPrescriptionClass}
              disabled={!canPrescribe}
            />
          </div>
          <div className="flex-1 p-5 md:p-6 overflow-y-auto bg-white custom-scrollbar">
            {activeTab === 'notes' && (
              <ConsultationForm value={form} onChange={setForm} readOnly={isReadOnly} />
            )}
            {activeTab === 'orders' && <ConsultationOrdersPanel orders={orders} />}
            {activeTab === 'prescriptions' && (
              canPrescribe ? (
                <PrescriptionBuilder />
              ) : (
                <div className="text-center p-10 text-amber-700 bg-amber-50 border border-amber-100 rounded-xl">
                  Cần đọc kết quả xét nghiệm trước khi kê đơn.
                </div>
              )
            )}
          </div>
        </section>
      </div>

      <ServiceOrderFormDialog
        isOpen={orderDialogOpen}
        onClose={() => setOrderDialogOpen(false)}
        onSubmit={handleCreateOrder}
        fixedRecordId={record?.recordId}
        fixedOrderedById={record?.mainDoctorId ?? (user?.role === 'DOCTOR' && user?.id ? Number(user.id) : undefined)}
        patientLabel={patientLabel}
      />

      <FollowUpFormDialog
        open={followUpDialogOpen}
        patientName={patientLabel}
        defaultDate={defaultFollowUpDate}
        onClose={finishAndExit}
        onSkip={finishAndExit}
        onSubmit={handleFollowUpSubmit}
        loading={followUpSaving}
      />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  className = '',
  disabled = false,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 font-semibold text-[13px] rounded-t-lg transition-all border-b-2 -mb-px ${className} ${
        active
          ? 'border-blue-600 text-blue-700 bg-white'
          : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-white/50'
      } ${disabled ? 'pointer-events-none' : ''}`}
    >
      {icon} {label}
    </button>
  );
}
