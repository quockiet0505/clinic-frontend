import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Save, ClipboardList, Pill, Loader2, FlaskConical, Hourglass, AlertCircle, ChevronRight, ChevronLeft, Stethoscope } from 'lucide-react';
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

  const [isExamining, setIsExamining] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('notes');
  const [record, setRecord] = useState<MedicalRecordDetail | null>(null);
  const [patient, setPatient] = useState<any>(null);
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
      setPatient(p);
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
  const isWaitingResult = (record?.status === 'WAITING_RESULT' || record?.appointmentStatus === 'WAITING_RESULT') && hasPendingOrders;
  const canSendToLab = Boolean(record?.appointmentId) && isInProgress && hasPendingOrders;
  const isReadOnly = isWaitingResult || record?.status === 'DONE';
  const hasPrescription = Boolean(record?.prescription);

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

  const commitDone = async (): Promise<boolean> => {
    if (!record) return false;
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
      return true;
    } catch {
      return false;
    }
  };

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
    // Only open the dialog — do NOT write DONE yet
    setFollowUpDialogOpen(true);
  };

  const handleSkipFollowUp = async () => {
    // User chose not to schedule follow-up — commit DONE then exit
    setCompleting(true);
    const ok = await commitDone();
    setCompleting(false);
    if (ok) finishAndExit();
  };

  const handleFollowUpSubmit = async (data: FollowUpFormData) => {
    if (!record?.mainDoctorId) return;
    setFollowUpSaving(true);
    // Commit DONE first, then create follow-up appointment
    const ok = await commitDone();
    if (!ok) { setFollowUpSaving(false); return; }
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

  const handleCreateOrder = async (data: { recordId: number; serviceId: number; orderedById: number; customServiceName?: string; doctorNote?: string; }) => {
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

  const recentVisits = patient?.recentVisits || [];

  return (
    <div className="space-y-5 animate-in fade-in duration-300 h-[calc(100vh-6rem)] flex flex-col">
      <div className="max-w-[1200px] mx-auto w-full flex flex-col h-full space-y-5">
        
        {/* Phase 1: Patient Details Overview */}
        {!isExamining ? (
          <>
            <DetailPageHeader
              title="Thông tin bệnh nhân"
              subtitle="Xem chi tiết hồ sơ y tế, sinh hiệu đo tại đón tiếp và quy trình trước khi khám"
              code={record ? `HS-${String(record.recordId).padStart(6, '0')}` : undefined}
              statusBadge={record?.status ? <StatusBadge status={record.status} /> : undefined}
              onBack={() => navigate('/medical/active-visits')}
              backLabel="Quay lại danh sách chờ"
              actions={
                <ActionButton
                  icon={<ChevronRight size={14} />}
                  label="Bắt đầu khám"
                  tone="primary"
                  onClick={() => setIsExamining(true)}
                />
              }
            />
            
            {/* Beautiful original layout PatientSummaryBanner */}
            <PatientSummaryBanner record={record} recordId={id} vitals={patientVitals} showVitals />

            {/* Flat beautiful steps and history layout */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              
              {/* Steps */}
              <div className="space-y-3 select-none">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quy trình phiên khám bệnh</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1">
                    <span className="font-bold text-blue-600">1. Khám lâm sàng</span>
                    <span className="text-slate-500">Ghi nhận triệu chứng, chẩn đoán ban đầu và kế hoạch điều trị.</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1">
                    <span className="font-bold text-violet-600">2. Chỉ định CLS</span>
                    <span className="text-slate-500">Chỉ định cận lâm sàng (xét nghiệm, siêu âm...) và theo dõi kết quả.</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1">
                    <span className="font-bold text-emerald-600">3. Kê đơn thuốc</span>
                    <span className="text-slate-500">Lập đơn thuốc từ danh mục thuốc và kiểm tra tương tác chéo.</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1">
                    <span className="font-bold text-indigo-600">4. Hoàn tất</span>
                    <span className="text-slate-500">Chốt bệnh án, in đơn thuốc và hẹn lịch tái khám nếu cần.</span>
                  </div>
                </div>
              </div>

              {/* Past Visits */}
              <div className="space-y-3 border-t border-slate-100 pt-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider select-none">Lịch sử khám gần đây</h3>
                {recentVisits.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {recentVisits.map((visit: any) => (
                      <div key={visit.recordId} className="py-2.5 flex items-center justify-between text-xs gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <span className="text-[11px] font-bold text-slate-400 tabular-nums shrink-0">{visit.date}</span>
                          <span className="font-bold text-slate-800 truncate">{visit.diagnosis}</span>
                        </div>
                        <div className="flex items-center gap-4 shrink-0 text-slate-450 font-bold">
                          <span className="hidden sm:inline-flex items-center gap-1">
                            <Stethoscope size={12} />
                            {visit.doctor}
                          </span>
                          <Button
                            variant="ghost"
                            onClick={() => navigate(`/medical-records/${visit.recordId}`)}
                            className="h-7 px-2.5 rounded-lg text-[11px] text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold cursor-pointer"
                          >
                            Xem hồ sơ &rarr;
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs italic py-2">
                    Không có lịch sử khám bệnh.
                  </p>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Phase 2: Active Workspace with Vertical Tabs (Hides patient information) */
          <>
            <DetailPageHeader
              title="Đang khám bệnh"
              subtitle={
                <span className="flex items-center gap-1.5">
                  Đang ghi nhận bệnh án cho bệnh nhân: <strong className="text-slate-800">{record?.patientFullName}</strong>
                </span>
              }
              code={record ? `HS-${String(record.recordId).padStart(6, '0')}` : undefined}
              statusBadge={record?.status ? <StatusBadge status={record.status} /> : undefined}
              onBack={() => setIsExamining(false)}
              backLabel="Xem thông tin bệnh nhân"
              actions={
                record?.status === 'DONE' ? undefined : (
                  isWaitingResult ? (
                    <ActionButton
                      icon={<FlaskConical size={14} />}
                      label="Tạo chỉ định"
                      tone="violet"
                      onClick={() => setOrderDialogOpen(true)}
                    />
                  ) : (
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
                        disabled={completing}
                        onClick={handleComplete}
                      />
                    </>
                  )
                )
              }
            />

            {isWaitingResult && (
              <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 shrink-0">
                <AlertCircle size={16} />
                Bệnh nhân đang chờ kết quả cận lâm sàng. Phiên khám ở chế độ chỉ xem.
              </div>
            )}



            <section className="flex-1 flex bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-0">
              {/* Left Column: Vertical Navigation Tab List */}
              <div className="w-[200px] shrink-0 border-r border-slate-200 bg-slate-50/50 flex flex-col p-2 pt-3 gap-1">
                <TabButton active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} icon={<ClipboardList size={16} />} label="Phiếu khám" />
                <TabButton
                  active={activeTab === 'orders'}
                  onClick={() => setActiveTab('orders')}
                  icon={<FlaskConical size={16} />}
                  label={`Chỉ định & KQ${orders.length ? ` (${orders.length})` : ''}`}
                />
                <TabButton
                  active={activeTab === 'prescriptions'}
                  onClick={() => canPrescribe && setActiveTab('prescriptions')}
                  icon={<Pill size={16} />}
                  label="Kê đơn thuốc"
                  className={tabPrescriptionClass}
                  disabled={!canPrescribe}
                />
              </div>

              {/* Right Column: Tab View Content */}
              <div className="flex-1 p-5 md:p-6 overflow-y-auto bg-white custom-scrollbar">
                {activeTab === 'notes' && (
                  <ConsultationForm value={form} onChange={setForm} readOnly={isReadOnly} />
                )}
                {activeTab === 'orders' && <ConsultationOrdersPanel orders={orders} />}
                {activeTab === 'prescriptions' && (
                  canPrescribe ? (
                    <PrescriptionBuilder recordId={recordId} />
                  ) : (
                    <div className="text-center p-10 text-amber-700 bg-amber-50 border border-amber-100 rounded-xl">
                      Cần đọc kết quả xét nghiệm trước khi kê đơn.
                    </div>
                  )
                )}
              </div>
            </section>
          </>
        )}
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
        onClose={() => setFollowUpDialogOpen(false)}
        onSkip={handleSkipFollowUp}
        onSubmit={handleFollowUpSubmit}
        loading={followUpSaving || completing}
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
      className={`cursor-pointer flex items-center gap-2.5 px-4 py-2.5 font-bold text-[13px] rounded-xl transition-all text-left w-full ${
        active
          ? 'bg-blue-50 text-blue-700 border-transparent shadow-sm'
          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
      } ${disabled ? 'pointer-events-none opacity-40' : ''} ${className}`}
    >
      {icon} <span className="truncate">{label}</span>
    </button>
  );
}
