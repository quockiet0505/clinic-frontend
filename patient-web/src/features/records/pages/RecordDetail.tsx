import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Stethoscope,
  FileText,
  FlaskConical,
  Pill,
  Calendar,
  CheckCircle2,
  Activity,
  Clock,
  Ban,
  CreditCard,
  FileBox,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Download,
  Loader2,
  Printer,
} from 'lucide-react';
import { SectionContainer } from '@/components/common';
import { ClinicPdfLayout } from '@/components/common/ClinicPdfLayout';
import { generatePdf, printPdfLayout } from '@/utils/generatePdf';
import { profileApi } from '@/features/profile/api/profileApi';
import type { PatientProfile } from '@/features/profile/types/profile';
import { recordApi } from '../api/recordApi';
import { appointmentApi } from '../../appointments/api/appointmentApi';
import type { MedicalRecordDetail } from '../types/record';
import type { AppointmentHistoryItem, Doctor } from '../../appointments/types/appointment';

const formatPrice = (v: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

function InlinePrice({ amount }: { amount?: number | null }) {
  if (amount == null || amount <= 0) return null;
  return (
    <span className="ml-1.5 text-[11px] font-semibold text-slate-400 tabular-nums">
      {formatPrice(amount)}
    </span>
  );
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

const STATUS_MAP: Record<
  string,
  { label: string; color: string; bg: string; ring: string; icon: React.ReactNode }
> = {
  DONE: {
    label: 'Hoàn thành',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    ring: 'ring-emerald-200/80',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  IN_PROGRESS: {
    label: 'Đang xử lý',
    color: 'text-primary-700',
    bg: 'bg-primary-50',
    ring: 'ring-primary-200/80',
    icon: <Activity className="w-3.5 h-3.5" />,
  },
  WAITING_RESULT: {
    label: 'Chờ kết quả',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    ring: 'ring-amber-200/80',
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  CANCELLED: {
    label: 'Đã hủy',
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    ring: 'ring-rose-200/80',
    icon: <Ban className="w-3.5 h-3.5" />,
  },
};

const LAB_STATUS_MAP: Record<string, { label: string; accent: string; bg: string }> = {
  PENDING: { label: 'Chờ thực hiện', accent: 'border-l-amber-400', bg: 'bg-amber-50/60' },
  IN_PROCESS: { label: 'Đang xử lý', accent: 'border-l-primary-400', bg: 'bg-primary-50/60' },
  COMPLETED: { label: 'Có kết quả', accent: 'border-l-emerald-500', bg: 'bg-emerald-50/50' },
  CANCELLED: { label: 'Đã hủy', accent: 'border-l-rose-400', bg: 'bg-rose-50/50' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_MAP[status] ?? STATUS_MAP.IN_PROGRESS;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold ring-1 ${cfg.bg} ${cfg.color} ${cfg.ring}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function SectionShell({
  title,
  icon,
  count,
  open,
  onToggle,
  accentClass = 'text-primary-600',
  children,
}: {
  title: string;
  icon: React.ReactNode;
  count?: number;
  open: boolean;
  onToggle: () => void;
  accentClass?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 hover:bg-slate-50/80 transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`shrink-0 ${accentClass}`}>{icon}</div>
          <h2 className="text-[15px] font-bold text-slate-800 truncate">{title}</h2>
          {count !== undefined && (
            <span className="shrink-0 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold">
              {count}
            </span>
          )}
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
        )}
      </button>
      {open && <div className="px-5 pb-5 pt-0 border-t border-slate-100">{children}</div>}
    </section>
  );
}

function EmptyBlock({ message }: { message: string }) {
  return (
    <div className="rounded-xl bg-slate-50/80 border border-dashed border-slate-200 px-4 py-8 text-center">
      <p className="text-[14px] text-slate-500">{message}</p>
    </div>
  );
}

export const RecordDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<MedicalRecordDetail | null>(null);
  const [appointment, setAppointment] = useState<AppointmentHistoryItem | null>(null);
  const [doctorInfo, setDoctorInfo] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(true);
  const [isLabOpen, setIsLabOpen] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    profileApi.getMyProfile().then(setPatientProfile).catch(() => {});
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const detail = await recordApi.getRecordDetail(Number(id));
        setRecord(detail);

        if (detail.appointmentId) {
          const appointments = await appointmentApi.getMyAppointments();
          const matchedAppt = appointments.find((a) => Number(a.id) === detail.appointmentId);
          if (matchedAppt) setAppointment(matchedAppt);
        }

        if (detail.mainDoctorId) {
          const doc = await appointmentApi.getDoctorById(detail.mainDoctorId);
          setDoctorInfo(doc);
        }
      } catch (err) {
        console.error('Error fetching record detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f0f9ff]">
        <div className="bg-gradient-to-r from-[var(--color-banner-dark-start)] via-[var(--color-banner-dark-mid)] to-primary-500 py-10 px-4">
          <SectionContainer className="max-w-6xl">
            <div className="h-4 bg-white/10 rounded w-40 mb-4 animate-pulse" />
            <div className="h-8 bg-white/10 rounded w-64 animate-pulse" />
          </SectionContainer>
        </div>
        <SectionContainer className="max-w-6xl py-8 px-4">
          <div className="grid lg:grid-cols-[300px_1fr] gap-6">
            <div className="h-72 bg-white/70 rounded-2xl animate-pulse" />
            <div className="h-96 bg-white/70 rounded-2xl animate-pulse" />
          </div>
        </SectionContainer>
      </main>
    );
  }

  if (!record) {
    return (
      <main className="min-h-screen bg-[#f0f9ff] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-7 h-7 text-slate-300" />
          </div>
          <p className="font-bold text-slate-700 text-[15px]">Không tìm thấy hồ sơ bệnh án</p>
          <p className="text-slate-500 text-sm mt-1">Mã hồ sơ có thể đã bị xóa hoặc bạn không có quyền xem.</p>
          <button
            type="button"
            onClick={() => navigate('/records/history')}
            className="mt-5 inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-[13px]"
          >
            <ArrowLeft className="w-4 h-4" /> Về danh sách hồ sơ
          </button>
        </div>
      </main>
    );
  }

  const hasPrescription = !!record.prescription?.items?.length;
  const activeOrders = record.serviceOrders?.filter((o) => o.status !== 'CANCELLED') ?? [];
  const consultationFinalFeeAmount = record.consultationFinalFee ?? 0;
  const orderFeesTotal = activeOrders.reduce((sum, o) => sum + (o.serviceFinalFee ?? 0), 0);
  const hasBilling =
    record.status === 'DONE' && (consultationFinalFeeAmount > 0 || orderFeesTotal > 0);
  const totalFee = consultationFinalFeeAmount + orderFeesTotal;

  const serviceDisplayName =
    appointment?.serviceName && appointment.serviceName !== 'Khám chuyên khoa'
      ? appointment.serviceName
      : 'Khám bệnh chuyên khoa';

  const pdfPatient = {
    name: record.patientFullName || patientProfile?.fullName,
    gender: record.patientGender || patientProfile?.gender,
    dob: record.patientDob || patientProfile?.dateOfBirth,
    phone: record.patientPhone || patientProfile?.phone,
    address: record.patientAddress || patientProfile?.address,
    bloodType: patientProfile?.bloodType,
    height: patientProfile?.height,
    weight: patientProfile?.weight,
    bloodPressure: patientProfile?.bloodPressure,
    pulse: patientProfile?.pulse,
    allergies: patientProfile?.allergies,
    medicalHistory: patientProfile?.medicalHistory,
  };

  const issuedDate = new Date(record.createdAt).toLocaleDateString('vi-VN');
  const recordCode = `#${String(record.recordId).padStart(6, '0')}`;

  const prescriptionTableRows =
    record.prescription?.items.map((item, idx) => ({
      index: idx + 1,
      name: item.medicineName,
      detail: item.dosage || '---',
      quantity: `${item.quantity} ${item.unit || ''}`.trim(),
    })) ?? [];

  const labExtraSections = activeOrders
    .filter((o) => o.result?.resultData)
    .map((o) => ({
      title: o.serviceName,
      content: [
        o.result!.resultData,
        o.result!.conclusion ? `Kết luận: ${o.result!.conclusion}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
      price: o.serviceFinalFee,
    }));

  const pdfFeeItems = [
    ...(consultationFinalFeeAmount > 0
      ? [{ label: `Phí khám · ${serviceDisplayName}`, amount: consultationFinalFeeAmount }]
      : []),
    ...activeOrders
      .filter((o) => (o.serviceFinalFee ?? 0) > 0)
      .map((o) => ({ label: o.serviceName, amount: o.serviceFinalFee! })),
  ];
  const hasPdfFees = pdfFeeItems.length > 0;
  const pdfTotalFee = pdfFeeItems.reduce((sum, item) => sum + item.amount, 0);

  const handleDownloadFullRecord = async () => {
    setPdfLoading(true);
    try {
      await generatePdf(
        `pdf-record-${record.recordId}`,
        `BenhAn_${String(record.recordId).padStart(6, '0')}.pdf`,
      );
    } finally {
      setPdfLoading(false);
    }
  };

  const doctorInitial = record.mainDoctorName?.charAt(0).toUpperCase() || 'B';
  const expertiseLabel = doctorInfo?.expertiseName || 'Chuyên khoa';

  return (
    <main className="min-h-screen bg-[#f0f9ff] pb-16">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[var(--color-banner-dark-start)] via-[var(--color-banner-dark-mid)] to-primary-500 py-8 md:py-10 px-4">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <SectionContainer className="max-w-6xl relative z-10">
          <nav className="flex items-center gap-1.5 text-[12px] font-semibold text-white/75 mb-4">
            <Link to="/" className="hover:text-white transition-colors">
              Trang chủ
            </Link>
            <span className="text-white/35">/</span>
            <Link to="/records/history" className="hover:text-white transition-colors">
              Hồ sơ y tế
            </Link>
            <span className="text-white/35">/</span>
            <span className="text-white">Chi tiết</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/25 shrink-0">
                <FileBox className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  Chi tiết bệnh án
                </h1>
                <p className="text-white/85 text-sm mt-0.5">
                  Mã hồ sơ{' '}
                  <span className="font-bold text-white tabular-nums">
                    #{String(record.recordId).padStart(6, '0')}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => printPdfLayout(`pdf-record-${record.recordId}`, 'Chi tiết bệnh án')}
                className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border text-[13px] font-semibold transition-colors cursor-pointer bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100 hover:border-sky-300"
              >
                <Printer className="w-4 h-4" />
                In bệnh án
              </button>
              <button
                type="button"
                onClick={handleDownloadFullRecord}
                disabled={pdfLoading}
                className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border text-[13px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-emerald-600 text-white border-transparent hover:bg-emerald-700 shadow-sm shadow-emerald-600/15"
              >
                {pdfLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Tải bệnh án
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[13px] font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </button>
            </div>
          </div>
        </SectionContainer>
      </div>

      <SectionContainer className="max-w-6xl px-4 pt-8 pb-4 md:pt-10">
        <div className="grid lg:grid-cols-[minmax(0,300px)_1fr] gap-6 items-start">
          {/* Sidebar */}
          <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
            {/* Doctor card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shrink-0 text-white font-bold text-xl overflow-hidden ring-4 ring-primary-50">
                  {doctorInfo?.imageUrl && !imgError ? (
                    <img
                      src={doctorInfo.imageUrl}
                      onError={() => setImgError(true)}
                      alt={record.mainDoctorName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    doctorInitial
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
                    Bác sĩ phụ trách
                  </p>
                  <h2 className="font-bold text-slate-900 text-[16px] leading-snug truncate">
                    {record.mainDoctorName}
                  </h2>
                  <p className="text-[13px] font-medium text-primary-600 mt-0.5">{expertiseLabel}</p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-start gap-3 text-[13px]">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-700">{formatDate(record.createdAt)}</p>
                    {appointment?.timeStart && (
                      <p className="text-slate-500 mt-0.5">
                        {appointment.timeStart.substring(0, 5)} –{' '}
                        {appointment.timeEnd?.substring(0, 5)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3 text-[13px]">
                  <Stethoscope className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <p className="font-medium text-slate-600">
                    {serviceDisplayName}
                    <InlinePrice amount={consultationFinalFeeAmount} />
                  </p>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Xét nghiệm', value: activeOrders.length, icon: FlaskConical },
                { label: 'Thuốc kê', value: record.prescription?.items?.length ?? 0, icon: Pill },
              ].map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-200/80 bg-white px-3 py-3 shadow-sm"
                >
                  <Icon className="w-4 h-4 text-primary-500 mb-2" />
                  <p className="text-[20px] font-black text-slate-800 tabular-nums leading-none">
                    {value}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-500 mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Billing */}
            {hasBilling && (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-4 h-4 text-primary-600" />
                  <h3 className="text-[14px] font-bold text-slate-800">Thanh toán</h3>
                </div>
                <div className="space-y-2.5 text-[13px]">
                  {consultationFinalFeeAmount > 0 && (
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-500 truncate pr-2">Phí khám · {serviceDisplayName}</span>
                      <span className="font-semibold text-slate-800 tabular-nums shrink-0">
                        {formatPrice(consultationFinalFeeAmount)}
                      </span>
                    </div>
                  )}
                  {activeOrders
                    .filter((o) => (o.serviceFinalFee ?? 0) > 0)
                    .map((order) => (
                      <div key={order.orderId} className="flex justify-between gap-2">
                        <span className="text-slate-500 truncate pr-2">{order.serviceName}</span>
                        <span className="font-semibold text-slate-800 tabular-nums shrink-0">
                          {formatPrice(order.serviceFinalFee!)}
                        </span>
                      </div>
                    ))}
                  <div className="border-t border-slate-100 pt-2.5 flex justify-between items-center">
                    <span className="font-bold text-slate-700">Tổng cộng</span>
                    <span className="text-[18px] font-black text-primary-700 tabular-nums">
                      {formatPrice(totalFee)}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg w-fit ring-1 ring-emerald-200/60">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Đã thanh toán
                </div>
              </div>
            )}

            {/* Trust */}
            <div className="rounded-xl border border-slate-200/60 bg-white/60 backdrop-blur-sm px-4 py-3 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-primary-500 shrink-0" />
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Hồ sơ điện tử được mã hóa và lưu trên hệ thống ClinicPro.
              </p>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex flex-col gap-5 min-w-0">
            {/* Diagnosis highlight */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2 min-w-0">
                  <Activity className="w-5 h-5 text-primary-600 shrink-0" />
                  <h2 className="text-[15px] font-bold text-slate-800">Chẩn đoán & điều trị</h2>
                </div>
                <StatusBadge status={record.status} />
              </div>

              <div className="rounded-xl border border-violet-100 border-l-[3px] border-l-violet-400 bg-violet-50/30 p-4 md:p-5 mb-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-600/70 mb-2">
                  Chẩn đoán
                </p>
                <p className="text-[14px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {record.diagnosis || (
                    <span className="text-slate-400 font-normal italic">Chưa cập nhật</span>
                  )}
                </p>
              </div>

              <div className="space-y-4">
                
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Phác đồ điều trị
                  </p>
                  <div className="text-[14px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {record.treatment || (
                      <span className="text-slate-400 italic">Chưa cập nhật</span>
                    )}
                  </div>
                </div>
                {record.note && (
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Ghi chú bác sĩ
                    </p>
                    <p className="text-[14px] text-slate-700 leading-relaxed">{record.note}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Lab */}
            <SectionShell
              title="Kết quả cận lâm sàng"
              icon={<FlaskConical className="w-5 h-5" />}
              count={activeOrders.length}
              open={isLabOpen}
              onToggle={() => setIsLabOpen(!isLabOpen)}
              accentClass="text-primary-600"
            >
              <div className="pt-4">
                {activeOrders.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {activeOrders.map((order) => {
                      const hasResult = !!order.result;
                      const computedStatus = hasResult ? 'COMPLETED' : order.status;
                      const labCfg = LAB_STATUS_MAP[computedStatus] ?? LAB_STATUS_MAP.PENDING;

                      return (
                        <article
                          key={order.orderId}
                          className={`rounded-xl border border-slate-200/80 border-l-4 ${labCfg.accent} ${labCfg.bg} p-4 md:p-5`}
                        >
                          <div className="mb-3">
                            <h3 className="font-bold text-slate-900 text-[15px]">
                              {order.serviceName}
                              <InlinePrice amount={order.serviceFinalFee} />
                            </h3>
                            <p className="text-[12px] font-medium text-slate-500 mt-1">
                              {labCfg.label}
                              {hasResult && order.result?.conclusion
                                ? ` · ${order.result.conclusion}`
                                : ''}
                            </p>
                          </div>

                          {hasResult ? (
                            <div className="text-[14px] text-slate-700 leading-relaxed whitespace-pre-wrap pl-3 border-l-2 border-slate-200/80">
                              {order.result!.resultData}
                            </div>
                          ) : (
                            <p className="text-[13px] text-slate-500 italic">
                              Đang chờ phòng xét nghiệm cập nhật kết quả...
                            </p>
                          )}

                          {order.result?.attachmentUrl && (
                            <a
                              href={order.result.attachmentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Xem file đính kèm
                            </a>
                          )}
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyBlock message="Không có chỉ định cận lâm sàng trong lần khám này." />
                )}
              </div>
            </SectionShell>

            {/* Prescription */}
            <SectionShell
              title="Đơn thuốc"
              icon={<Pill className="w-5 h-5" />}
              count={record.prescription?.items?.length ?? 0}
              open={isPrescriptionOpen}
              onToggle={() => setIsPrescriptionOpen(!isPrescriptionOpen)}
              accentClass="text-emerald-600"
            >
              <div className="pt-4">
                {hasPrescription ? (
                  <>
                    <ul className="flex flex-col gap-3">
                    {record.prescription!.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3.5"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                            <Pill className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 text-[14px] truncate">
                              {item.medicineName}
                            </p>
                            <p className="text-[12px] text-slate-500 mt-0.5 line-clamp-2">
                              {item.dosage}
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex self-start sm:self-center items-center px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[12px] font-bold text-slate-700 tabular-nums shrink-0">
                          {item.quantity} {item.unit}
                        </span>
                      </li>
                    ))}
                    </ul>
                  </>
                ) : (
                  <EmptyBlock message="Bác sĩ không kê đơn thuốc cho lần khám này." />
                )}
              </div>
            </SectionShell>
          </div>
        </div>
      </SectionContainer>

      {/* Hidden PDF layouts */}
      <ClinicPdfLayout
        id={`pdf-record-${record.recordId}`}
        documentTitle="CHI TIẾT BỆNH ÁN"
        documentCode={recordCode}
        issuedDate={issuedDate}
        patient={pdfPatient}
        doctorName={record.mainDoctorName}
        doctorSpecialty={expertiseLabel}
        diagnosis={record.diagnosis}
        serviceName={serviceDisplayName}
        tableRows={prescriptionTableRows}
        notes={record.treatment || record.note}
        extraSections={labExtraSections}
        consultationFinalFee={hasPdfFees && consultationFinalFeeAmount > 0 ? consultationFinalFeeAmount : undefined}
        feeItems={hasPdfFees ? pdfFeeItems : undefined}
        totalAmount={hasPdfFees ? pdfTotalFee : undefined}
        footerNote="Phiếu khám bệnh điện tử — ClinicPro. Vui lòng mang theo khi tái khám."
      />
    </main>
  );
};
